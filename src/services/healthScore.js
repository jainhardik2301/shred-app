export function calculateHealthScore(user) {

    const metrics = [

        user.today.protein / user.goals.targetProtein,

        user.today.water / user.goals.targetWater,

        user.today.calories / user.goals.targetCalories,

        user.today.sleep / user.goals.targetSleep,

        user.today.steps / user.goals.targetSteps,

    ];

    const total =
        metrics.reduce((sum, value) => sum + Math.min(value, 1), 0);

    return Math.round((total / metrics.length) * 100);
}