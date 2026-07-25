import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";
import { exerciseLibrary } from "../data/exerciseLibrary";


const AppContext = createContext();

const defaultSchedule = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
};

const defaultData = {
  profile: {
    name: "",
    age: 0,
    gender: "",
    height: 0,
    weight: 0,
    bmi: 0,
  },

  onboardingProfile: {
    // Step 1 - Basic Information
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",

    // Step 2 - Goals
    primaryGoal: "",
    targetWeight: "",
    targetDate: "",

    // Step 3 - Lifestyle
    activityLevel: "",
    occupationType: "",
    dailySteps: "",
    sleepHours: "",

    // Step 4 - Nutrition
    dietType: "",
    mealsPerDay: "",
    cookingFrequency: "",
    nutritionChallenges: [],

    // Step 5 - Training
    experienceLevel: "",
    workoutLocation: "",
    workoutDays: "",
    sessionDuration: "",
    trainingPreferences: [],
    equipment: [],

    // Step 6 - Challenges & Commitment
    challenges: [],
    confidenceLevel: "",
commitmentLevel: "",
biggestObstacle: "",
successVision: "",

    // Step 7 - Health & Limitations
    medicalConditions: [],
    injuries: "",
medicalRestrictions: "",
medications: "",
nutritionalDeficiencies: "",
additionalNotes: "",

    // Onboarding Status
    completed: false,
    completedAt: null,
  },

  activeSchedule: defaultSchedule,

  goals: {
    calories: 0,
    protein: 0,
    water: 0,
    steps: 0,
    targetWeight: 0,
    targetDate: "",
  },

  today: {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    water: 0,
    steps: 0,
    sleep: 0,
  },

  history: {
    weight: [],
  },

  dailyHistory: {},

currentDate: new Date().toLocaleDateString("en-CA"),
  
  meals: [],

  workoutPlans: [],

  activeWorkout: null,

  workoutHistory: [],

habitHistory: {},

// Saved AI onboarding assessment
assessment: null,

// Personalized AI nutrition plan
nutritionPlan: null,

// AI-generated daily coaching insight
dailyCoach: null,
};

function initializeData() {
  const saved =
    localStorage.getItem(
      "shred-app-data"
    );

  if (!saved) {
    return defaultData;
  }

  try {
    const parsed =
      JSON.parse(saved);

    return {
      ...defaultData,
      ...parsed,

      currentDate:
  parsed.currentDate ||
  new Date().toLocaleDateString("en-CA"),      
      
      profile: {
        ...defaultData.profile,
        ...(parsed.profile || {}),
      },

      goals: {
        ...defaultData.goals,
        ...(parsed.goals || {}),
      },

      today: {
        ...defaultData.today,
        ...(parsed.today || {}),
      },

      habitHistory: parsed.habitHistory || {},

      dailyHistory:
  parsed.dailyHistory &&
  typeof parsed.dailyHistory === "object"
    ? parsed.dailyHistory
    : {},

currentDate:
  parsed.currentDate ||
  new Date().toLocaleDateString("en-CA"),
      
      history: {
        weight:
          parsed.history?.weight ||
          [],
      },

      meals: Array.isArray(
        parsed.meals
      )
        ? parsed.meals
        : [],

      workoutPlans:
  Array.isArray(parsed.workoutPlans)
    ? parsed.workoutPlans
    : [],

      activeSchedule: {
        ...defaultSchedule,
        ...(parsed.activeSchedule ||
          {}),
      },

      activeWorkout:
        parsed.activeWorkout ||
        null,

      workoutHistory:
        Array.isArray(
          parsed.workoutHistory
        )
          ? parsed.workoutHistory
          : [],
    };
  } catch (error) {
    console.error(
      "Invalid Local Storage Data",
      error
    );

    return defaultData;
  }
}

export function AppProvider({
  children,
}) {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [appData, setAppData] =
    useState(defaultData);

  const [
    cloudReady,
    setCloudReady,
  ] = useState(false);

  const saveTimerRef =
    useRef(null);

  // LOAD USER DATA FROM SUPABASE
  useEffect(() => {
    let cancelled = false;

    async function loadCloudData() {
      if (authLoading) return;

      if (!user) {
        setAppData(defaultData);
        setCloudReady(false);
        return;
      }

      setCloudReady(false);

      const {
        data,
        error,
      } = await supabase
        .from("user_app_data")
        .select("app_data")
        .eq("user_id", user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error(
          "Failed to load SHRED cloud data:",
          error
        );

        setAppData(defaultData);
        setCloudReady(true);

        return;
      }

      if (data?.app_data) {
        const saved =
          data.app_data;

        setAppData({
          ...defaultData,
          ...saved,

          profile: {
            ...defaultData.profile,
            ...(saved.profile || {}),
          },

          goals: {
            ...defaultData.goals,
            ...(saved.goals || {}),
          },

          today: {
            ...defaultData.today,
            ...(saved.today || {}),
          },

          history: {
            ...defaultData.history,
            ...(saved.history || {}),

            weight:
              saved.history
                ?.weight || [],
          },

          dailyHistory:
            saved.dailyHistory &&
            typeof saved.dailyHistory ===
              "object"
              ? saved.dailyHistory
              : {},

          habitHistory:
            saved.habitHistory ||
            {},

          meals:
            Array.isArray(
              saved.meals
            )
              ? saved.meals
              : [],

          workoutPlans:
  Array.isArray(saved.workoutPlans)
    ? saved.workoutPlans
    : [],

          activeSchedule: {
            ...defaultSchedule,
            ...(saved.activeSchedule ||
              {}),
          },

          activeWorkout:
            saved.activeWorkout ||
            null,

          workoutHistory:
            Array.isArray(
              saved.workoutHistory
            )
              ? saved.workoutHistory
              : [],

          currentDate:
            saved.currentDate ||
            new Date()
              .toLocaleDateString(
                "en-CA"
              ),
        });
      } else {
        // Brand-new Supabase user
        // gets completely fresh SHRED data.

        setAppData({
          ...defaultData,

          currentDate:
            new Date()
              .toLocaleDateString(
                "en-CA"
              ),
        });
      }

      setCloudReady(true);
    }

    loadCloudData();

    return () => {
      cancelled = true;
    };
  }, [
    user?.id,
    authLoading,
  ]);

  // AUTOMATICALLY SAVE USER DATA
  // TO SUPABASE
  useEffect(() => {
    if (
      authLoading ||
      !user ||
      !cloudReady
    ) {
      return;
    }

    if (
      saveTimerRef.current
    ) {
      window.clearTimeout(
        saveTimerRef.current
      );
    }

    saveTimerRef.current =
      window.setTimeout(
        async () => {
          const {
            error,
          } = await supabase
            .from(
              "user_app_data"
            )
            .upsert(
              {
                user_id:
                  user.id,

                app_data:
                  appData,

                updated_at:
                  new Date()
                    .toISOString(),
              },
              {
                onConflict:
                  "user_id",
              }
            );

          if (error) {
            console.error(
              "Failed to save SHRED cloud data:",
              error
            );
          }
        },
        700
      );

    return () => {
      if (
        saveTimerRef.current
      ) {
        window.clearTimeout(
          saveTimerRef.current
        );
      }
    };
  }, [
    appData,
    user?.id,
    authLoading,
    cloudReady,
  ]);

  useEffect(() => {
  if (
    authLoading ||
    !user ||
    !cloudReady
  ) {
    return;
  }

  function handleDailyRollover() {
    const todayDate =
      new Date().toLocaleDateString(
        "en-CA"
      );

    setAppData((prev) => {
      if (!prev) return prev;

      const savedDate =
        prev.currentDate ||
        todayDate;

      // SAME DAY — NOTHING TO ARCHIVE
      if (
        savedDate === todayDate
      ) {
        if (!prev.currentDate) {
          return {
            ...prev,
            currentDate:
              todayDate,
          };
        }

        return prev;
      }

      // PREVIOUS DAY DATA
      const previousToday = {
        ...defaultData.today,
        ...(prev.today || {}),
      };

      const previousMeals =
        Array.isArray(prev.meals)
          ? prev.meals
          : [];

      const previousWorkouts =
        Array.isArray(
          prev.workoutHistory
        )
          ? prev.workoutHistory.filter(
              (workout) => {
                const date =
                  workout?.completedAt ||
                  workout?.startedAt;

                if (!date) {
                  return false;
                }

                return (
                  new Date(
                    date
                  ).toLocaleDateString(
                    "en-CA"
                  ) === savedDate
                );
              }
            )
          : [];

      const existingDay =
        prev.dailyHistory?.[
          savedDate
        ] || {};

      return {
        ...prev,

        currentDate:
          todayDate,

        dailyHistory: {
          ...(prev.dailyHistory ||
            {}),

          [savedDate]: {
            ...existingDay,

            date: savedDate,

            nutrition: {
              calories:
                Number(
                  previousToday
                    .calories
                ) || 0,

              protein:
                Number(
                  previousToday
                    .protein
                ) || 0,

              carbs:
                Number(
                  previousToday
                    .carbs
                ) || 0,

              fat:
                Number(
                  previousToday
                    .fat
                ) || 0,
            },

            habits: {
              water:
                Number(
                  previousToday.water
                ) || 0,

              steps:
                Number(
                  previousToday.steps
                ) || 0,

              sleep:
                Number(
                  previousToday.sleep
                ) || 0,
            },

            meals:
              previousMeals,

            workouts:
              previousWorkouts,
          },
        },

        // RESET ONLY DAILY DATA
        today: {
          ...defaultData.today,
        },

        meals: [],
      };
    });
  }

  // CHECK IMMEDIATELY AFTER
  // CLOUD DATA HAS LOADED
  handleDailyRollover();

  // CHECK EVERY MINUTE WHILE
  // APP REMAINS OPEN
  const interval =
    window.setInterval(
      handleDailyRollover,
      60000
    );

  // CHECK WHEN USER RETURNS
  // TO THE APP
  function handleVisibilityChange() {
    if (
      document.visibilityState ===
      "visible"
    ) {
      handleDailyRollover();
    }
  }

  document.addEventListener(
    "visibilitychange",
    handleVisibilityChange
  );

  return () => {
    window.clearInterval(
      interval
    );

    document.removeEventListener(
      "visibilitychange",
      handleVisibilityChange
    );
  };
}, [
  user?.id,
  authLoading,
  cloudReady,
]);

  function calculateMealTotals(meals = []) {
  return meals.reduce(
    (totals, meal) => ({
      calories:
        totals.calories +
        (Number(meal?.calories) || 0),

      protein:
        totals.protein +
        (Number(meal?.protein) || 0),

      carbs:
        totals.carbs +
        (Number(meal?.carbs) || 0),

      fat:
        totals.fat +
        (Number(meal?.fat) || 0),
    }),
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    }
  );
}


function addMeal(meal) {
  setAppData((prev) => {
    const meals = [
      ...(prev.meals || []),
      meal,
    ];

    const totals =
      calculateMealTotals(meals);

    return {
      ...prev,

      meals,

      today: {
        ...prev.today,

        calories:
          Math.round(
            totals.calories
          ),

        protein:
          Number(
            totals.protein.toFixed(1)
          ),

        carbs:
          Number(
            totals.carbs.toFixed(1)
          ),

        fat:
          Number(
            totals.fat.toFixed(1)
          ),
      },
    };
  });
}


function deleteMeal(index) {
  setAppData((prev) => {
    const meals = (
      prev.meals || []
    ).filter(
      (_, i) => i !== index
    );

    const totals =
      calculateMealTotals(meals);

    return {
      ...prev,

      meals,

      today: {
        ...prev.today,

        calories:
          Math.round(
            totals.calories
          ),

        protein:
          Number(
            totals.protein.toFixed(1)
          ),

        carbs:
          Number(
            totals.carbs.toFixed(1)
          ),

        fat:
          Number(
            totals.fat.toFixed(1)
          ),
      },
    };
  });
}


function updateMeal(
  index,
  updatedMeal
) {
  setAppData((prev) => {
    const meals = [
      ...(prev.meals || []),
    ];

    if (!meals[index]) {
      return prev;
    }

    meals[index] =
      updatedMeal;

    const totals =
      calculateMealTotals(meals);

    return {
      ...prev,

      meals,

      today: {
        ...prev.today,

        calories:
          Math.round(
            totals.calories
          ),

        protein:
          Number(
            totals.protein.toFixed(1)
          ),

        carbs:
          Number(
            totals.carbs.toFixed(1)
          ),

        fat:
          Number(
            totals.fat.toFixed(1)
          ),
      },
    };
  });
}

  function updateWeight(weight) {
    const numericWeight =
      Number(weight);

    setAppData((prev) => ({
      ...prev,

      profile: {
        ...(prev.profile ||
          {}),
        weight:
          numericWeight,
      },

      history: {
        ...prev.history,

        weight: [
          ...(prev.history
            ?.weight || []),

          {
            date:
              new Date().toISOString(),

            value:
              numericWeight,
          },
        ],
      },
    }));
  }

  function setActiveWorkoutPlan(planId) {
  setAppData((prev) => ({
    ...prev,

    workoutPlans: (
      prev.workoutPlans || []
    ).map((plan) => ({
      ...plan,

      isActive:
        String(plan.id) ===
        String(planId),
    })),
  }));
}
  
  function addWorkoutPlan(plan) {
  setAppData((prev) => {
    const existingPlans =
      prev.workoutPlans || [];

    const updatedExistingPlans =
      plan.isActive
        ? existingPlans.map(
            (existingPlan) => ({
              ...existingPlan,
              isActive: false,
            })
          )
        : existingPlans;

    return {
      ...prev,

      workoutPlans: [
        ...updatedExistingPlans,
        plan,
      ],
    };
  });
}

  function addExerciseToWorkoutPlan(
    planId,
    exercise
  ) {
    setAppData((prev) => ({
      ...prev,

      workoutPlans: (
        prev.workoutPlans ||
        []
      ).map((plan) =>
        String(plan.id) ===
        String(planId)
          ? {
              ...plan,

              exercises: [
                ...(plan.exercises ||
                  []),

                exercise,
              ],
            }
          : plan
      ),
    }));
  }

  function removeExerciseFromWorkoutPlan(
    planId,
    exerciseId
  ) {
    setAppData((prev) => ({
      ...prev,

      workoutPlans: (
        prev.workoutPlans ||
        []
      ).map((plan) =>
        String(plan.id) ===
        String(planId)
          ? {
              ...plan,

              exercises: (
                plan.exercises ||
                []
              ).filter(
                (exercise) => {
                  const id =
                    typeof exercise ===
                    "object"
                      ? exercise.id
                      : exercise;

                  return (
                    String(id) !==
                    String(
                      exerciseId
                    )
                  );
                }
              ),
            }
          : plan
      ),
    }));
  }

  function updateExerciseInWorkoutPlan(
  planId,
  exerciseId,
  updatedExercise
) {
  setAppData((prev) => ({
    ...prev,

    workoutPlans: (
      prev.workoutPlans || []
    ).map((plan) =>
      String(plan.id) === String(planId)
        ? {
            ...plan,

            exercises: (
              plan.exercises || []
            ).map((exercise) => {
              const currentId =
                typeof exercise === "object"
                  ? exercise.id
                  : exercise;

              if (
                String(currentId) !==
                String(exerciseId)
              ) {
                return exercise;
              }

              return {
                ...updatedExercise,
                id: currentId,
              };
            }),
          }
        : plan
    ),
  }));
}
  
  function renameWorkoutPlan(
    planId,
    name
  ) {
    setAppData((prev) => ({
      ...prev,

      workoutPlans: (
        prev.workoutPlans ||
        []
      ).map((plan) =>
        String(plan.id) ===
        String(planId)
          ? {
              ...plan,
              name,
            }
          : plan
      ),
    }));
  }

  function deleteWorkoutPlan(
    planId
  ) {
    setAppData((prev) => ({
      ...prev,

      workoutPlans: (
        prev.workoutPlans ||
        []
      ).filter(
        (plan) =>
          String(plan.id) !==
          String(planId)
      ),
    }));
  }

  function duplicateWorkoutPlan(
    planId
  ) {
    setAppData((prev) => {
      const plan = (
        prev.workoutPlans ||
        []
      ).find(
        (item) =>
          String(item.id) ===
          String(planId)
      );

      if (!plan) return prev;

      return {
        ...prev,

        workoutPlans: [
          ...(prev.workoutPlans ||
            []),

          {
            ...plan,

            id: Date.now(),

            name: `${plan.name} Copy`,

            isDefault: false,

            exercises: [
              ...(plan.exercises ||
                []),
            ],
          },
        ],
      };
    });
  }

  function updateWorkoutPlan(updatedPlan) {
  setAppData((prev) => ({
    ...prev,

    workoutPlans: (
      prev.workoutPlans || []
    ).map((plan) =>
      String(plan.id) ===
      String(updatedPlan.id)
        ? updatedPlan
        : plan
    ),
  }));
}

  function assignWorkoutToDay(
    day,
    planId
  ) {
    setAppData((prev) => ({
      ...prev,

      activeSchedule: {
        ...defaultSchedule,
        ...(prev.activeSchedule ||
          {}),

        [day]:
          planId,
      },
    }));
  }

  function getExerciseDetails(
    item
  ) {
    if (
      typeof item ===
        "object" &&
      item !== null
    ) {
      return item;
    }

    const allExercises =
      Object.values(
        exerciseLibrary ||
          {}
      ).flat();

    return allExercises.find(
      (exercise) =>
        String(
          exercise.id
        ) ===
        String(item)
    );
  }

 function startWorkoutSession(
  planId,
  dayId
) {
  setAppData((prev) => {

    // ---------------------------------
    // FIND PLAN
    // ---------------------------------

    const plan = (
      prev.workoutPlans || []
    ).find(
      (item) =>
        String(item.id) ===
        String(planId)
    );

    if (!plan) {
      console.error(
        "Workout plan not found."
      );

      return prev;
    }

    // ---------------------------------
    // FIND WORKOUT DAY
    // ---------------------------------

    const workoutDay = (
      plan.days || []
    ).find(
      (day) =>
        String(day.id) ===
        String(dayId)
    );

    if (!workoutDay) {
      console.error(
        "Workout day not found."
      );

      return prev;
    }

    if (workoutDay.isRestDay) {
      console.error(
        "Cannot start workout on a recovery day."
      );

      return prev;
    }

    // ---------------------------------
    // BUILD ACTIVE WORKOUT
    // ---------------------------------

    const resolvedExercises = (
      workoutDay.exercises || []
    ).map((exercise) => {

      const setCount =
        Math.max(
          1,
          Number(
            exercise.sets
          ) || 3
        );

      const targetReps =
        String(
          exercise.reps ||
          "8-12"
        );

      const workoutSets =
        Array.from(
          {
            length: setCount,
          },
          () => ({
            reps: targetReps,

            weight: "",

            completed: false,
          })
        );

      return {
        ...exercise,

        targetSets:
          setCount,

        targetReps,

        // During an active workout,
        // sets becomes an array used
        // for workout tracking.

        sets:
          workoutSets,
      };
    });

    // ---------------------------------
    // CREATE ACTIVE WORKOUT
    // ---------------------------------

    return {
      ...prev,

      activeWorkout: {
        id:
          `workout-${Date.now()}`,

        planId:
          plan.id,

        planName:
          plan.name,

        dayId:
          workoutDay.id,

        day:
          workoutDay.day,

        name:
          workoutDay.name,

        startedAt:
          new Date().toISOString(),

        seconds: 0,

        running: true,

        exercises:
          resolvedExercises,
      },
    };
  });
}

  function pauseWorkoutSession() {
    setAppData((prev) => {
      if (
        !prev.activeWorkout
      ) {
        return prev;
      }

      return {
        ...prev,

        activeWorkout: {
          ...prev.activeWorkout,

          running: false,
        },
      };
    });
  }

  function resumeWorkoutSession() {
    setAppData((prev) => {
      if (
        !prev.activeWorkout
      ) {
        return prev;
      }

      return {
        ...prev,

        activeWorkout: {
          ...prev.activeWorkout,

          running: true,
        },
      };
    });
  }

  function incrementWorkoutTimer() {
    setAppData((prev) => {
      if (
        !prev.activeWorkout
          ?.running
      ) {
        return prev;
      }

      return {
        ...prev,

        activeWorkout: {
          ...prev.activeWorkout,

          seconds:
            (prev
              .activeWorkout
              .seconds ||
              0) + 1,
        },
      };
    });
  }

  function updateActiveWorkoutSet(
    exerciseIndex,
    setIndex,
    field,
    value
  ) {
    setAppData((prev) => {
      if (
        !prev.activeWorkout
      ) {
        return prev;
      }

      const exercises =
        prev.activeWorkout.exercises.map(
          (
            exercise,
            currentExerciseIndex
          ) => {
            if (
              currentExerciseIndex !==
              exerciseIndex
            ) {
              return exercise;
            }

            return {
              ...exercise,

              sets:
                exercise.sets.map(
                  (
                    set,
                    currentSetIndex
                  ) =>
                    currentSetIndex ===
                    setIndex
                      ? {
                          ...set,

                          [field]:
                            value,
                        }
                      : set
                ),
            };
          }
        );

      return {
        ...prev,

        activeWorkout: {
          ...prev.activeWorkout,

          exercises,
        },
      };
    });
  }

  function toggleActiveWorkoutSet(
    exerciseIndex,
    setIndex
  ) {
    setAppData((prev) => {
      if (
        !prev.activeWorkout
      ) {
        return prev;
      }

      const exercises =
        prev.activeWorkout.exercises.map(
          (
            exercise,
            currentExerciseIndex
          ) => {
            if (
              currentExerciseIndex !==
              exerciseIndex
            ) {
              return exercise;
            }

            return {
              ...exercise,

              sets:
                exercise.sets.map(
                  (
                    set,
                    currentSetIndex
                  ) =>
                    currentSetIndex ===
                    setIndex
                      ? {
                          ...set,

                          completed:
                            !set.completed,
                        }
                      : set
                ),
            };
          }
        );

      return {
        ...prev,

        activeWorkout: {
          ...prev.activeWorkout,

          exercises,
        },
      };
    });
  }

  function resetWorkoutSession() {
    setAppData((prev) => ({
      ...prev,

      activeWorkout:
        null,
    }));
  }

  function finishWorkoutSession() {
  setAppData((prev) => {
    const activeWorkout =
      prev.activeWorkout;

    if (!activeWorkout) {
      return prev;
    }

    // Calculate completed sets

    const totalSets =
      (
        activeWorkout.exercises ||
        []
      ).reduce(
        (total, exercise) =>
          total +
          (
            exercise.sets || []
          ).length,
        0
      );

    const completedSets =
      (
        activeWorkout.exercises ||
        []
      ).reduce(
        (total, exercise) =>
          total +
          (
            exercise.sets || []
          ).filter(
            (set) =>
              set.completed
          ).length,
        0
      );

    // Same calorie calculation currently
    // used by WorkoutSessionCard

    const calories =
      Math.floor(
        (
          activeWorkout.seconds ||
          0
        ) * 0.18
      );

    const completedWorkout = {
      ...activeWorkout,

      id:
        `history-${Date.now()}`,

      sessionId:
        activeWorkout.id,

      completedAt:
        new Date().toISOString(),

      durationSeconds:
        activeWorkout.seconds ||
        0,

      calories,

      totalSets,

      completedSets,

      completionPercentage:
        totalSets > 0
          ? Math.round(
              (
                completedSets /
                totalSets
              ) * 100
            )
          : 0,

      running: false,

      status: "completed",
    };

    return {
      ...prev,

      workoutHistory: [
        ...(
          prev.workoutHistory ||
          []
        ),
        completedWorkout,
      ],

      activeWorkout: null,
    };
  });
}

  return (
    <AppContext.Provider
  value={{
    appData,
    setAppData,
    cloudReady,

    addMeal,
        deleteMeal,
        updateMeal,
        updateWeight,

        setActiveWorkoutPlan,
        addWorkoutPlan,
        addExerciseToWorkoutPlan,
        removeExerciseFromWorkoutPlan,
        updateExerciseInWorkoutPlan,
        renameWorkoutPlan,
        deleteWorkoutPlan,
        duplicateWorkoutPlan,
        updateWorkoutPlan,
        assignWorkoutToDay,

        startWorkoutSession,
        pauseWorkoutSession,
        resumeWorkoutSession,
        incrementWorkoutTimer,
        updateActiveWorkoutSet,
        toggleActiveWorkoutSet,
        resetWorkoutSession,
        finishWorkoutSession,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(
    AppContext
  );
}