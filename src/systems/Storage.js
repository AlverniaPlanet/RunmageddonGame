const STORAGE_KEY = 'runmageddon_runner_highscore';
const RANKING_KEY = 'runmageddon_runner_ranking';
const SKIN_KEY = 'runmageddon_runner_skin';
const MAX_RANKING_ENTRIES = 10;

export class Storage {
  static getSelectedSkin() {
    const raw = localStorage.getItem(SKIN_KEY);
    if (!raw) return 'default';
    return ['default', 'o', 'michalina', 'paulina'].includes(raw) ? raw : 'default';
  }

  static setSelectedSkin(skinId) {
    const safe = ['default', 'o', 'michalina', 'paulina'].includes(skinId) ? skinId : 'default';
    localStorage.setItem(SKIN_KEY, safe);
    return safe;
  }

  static getHighscore() {
    const rawValue = localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return 0;
    }

    const parsed = Number.parseInt(rawValue, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  static updateHighscore(score) {
    const current = Storage.getHighscore();

    if (score > current) {
      localStorage.setItem(STORAGE_KEY, `${score}`);
      return score;
    }

    return current;
  }

  static getRanking() {
    const raw = localStorage.getItem(RANKING_KEY);
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      return parsed
        .map((entry) => ({
          id: entry.id ?? `${entry.timestamp ?? Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
          score: Number.parseInt(entry.score, 10),
          timestamp: Number.parseInt(entry.timestamp, 10),
          name:
            typeof entry.name === 'string' && entry.name.trim().length > 0
              ? entry.name.trim().slice(0, 20)
              : 'Anon',
        }))
        .filter((entry) => Number.isFinite(entry.score) && entry.score >= 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX_RANKING_ENTRIES);
    } catch {
      return [];
    }
  }

  static addScore(score, name = 'Anon') {
    const safeScore = Math.max(0, Number.parseInt(score, 10) || 0);
    const ranking = Storage.getRanking();
    const entryId = `${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;

    ranking.push({
      id: entryId,
      score: safeScore,
      timestamp: Date.now(),
      name: (name || 'Anon').trim().slice(0, 20) || 'Anon',
    });

    const sorted = ranking.sort((a, b) => b.score - a.score).slice(0, MAX_RANKING_ENTRIES);
    localStorage.setItem(RANKING_KEY, JSON.stringify(sorted));
    Storage.updateHighscore(safeScore);

    return { ranking: sorted, entryId };
  }

  static setEntryName(entryId, name) {
    if (!entryId) {
      return Storage.getRanking();
    }

    const normalized = (name || '').trim().slice(0, 20);
    if (!normalized) {
      return Storage.getRanking();
    }

    const ranking = Storage.getRanking().map((entry) => {
      if (entry.id !== entryId) {
        return entry;
      }
      return {
        ...entry,
        name: normalized,
      };
    });

    localStorage.setItem(RANKING_KEY, JSON.stringify(ranking));
    return ranking;
  }
}
