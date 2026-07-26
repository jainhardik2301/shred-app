let timer = null;
let isRefreshing = false;
let refreshPending = false;

const DEFAULT_DELAY = 10000;

class AIRefreshManager {
  schedule(callback, delay = DEFAULT_DELAY) {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      timer = null;
      this.run(callback);
    }, delay);
  }

  async run(callback) {
    if (isRefreshing) {
      refreshPending = true;
      return;
    }

    isRefreshing = true;

    try {
      await callback();
    } catch (err) {
      console.error(err);
    } finally {
      isRefreshing = false;

      if (refreshPending) {
        refreshPending = false;
        this.run(callback);
      }
    }
  }

  cancel() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  getStatus() {
    return {
      timerActive: !!timer,
      isRefreshing,
      refreshPending,
    };
  }
}

export default new AIRefreshManager();