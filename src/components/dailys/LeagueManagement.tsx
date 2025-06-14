import { FC, useState } from "react";
import styles from "./LeagueManagement.module.css";

interface League {
  id: string;
  name: string;
  memberCount: number;
  isOwner: boolean;
  isPrivate: boolean;
}

interface LeagueManagementProps {
  selectedGame: string | null;
}

const MOCK_LEAGUES: League[] = [
  {
    id: "1",
    name: "Friends League",
    memberCount: 5,
    isOwner: true,
    isPrivate: true,
  },
  {
    id: "2",
    name: "Work Group",
    memberCount: 8,
    isOwner: false,
    isPrivate: true,
  },
  {
    id: "3",
    name: "Public League",
    memberCount: 25,
    isOwner: false,
    isPrivate: false,
  },
];

export const LeagueManagement: FC<LeagueManagementProps> = ({
  selectedGame,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newLeagueName, setNewLeagueName] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [inviteCode, setInviteCode] = useState("");

  const handleCreateLeague = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement league creation
    console.log("Creating league:", { name: newLeagueName, isPrivate });
    setNewLeagueName("");
    setIsPrivate(true);
    setShowCreateModal(false);
  };

  const handleJoinLeague = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement league joining
    console.log("Joining league with code:", inviteCode);
    setInviteCode("");
    setShowJoinModal(false);
  };

  if (!selectedGame) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Your Leagues</h2>
        <div className={styles.actions}>
          <button
            className={styles.actionButton}
            onClick={() => setShowCreateModal(true)}
          >
            Create League
          </button>
          <button
            className={styles.actionButton}
            onClick={() => setShowJoinModal(true)}
          >
            Join League
          </button>
        </div>
      </div>

      <div className={styles.leagues}>
        {MOCK_LEAGUES.map((league) => (
          <div key={league.id} className={styles.league}>
            <div className={styles.leagueInfo}>
              <span className={styles.leagueName}>{league.name}</span>
              <div className={styles.leagueMeta}>
                <span>{league.memberCount} members</span>
                {league.isPrivate && (
                  <span className={styles.privateBadge}>Private</span>
                )}
              </div>
            </div>
            <div className={styles.leagueActions}>
              {league.isOwner ? (
                <button className={styles.manageButton}>Manage</button>
              ) : (
                <button className={styles.leaveButton}>Leave</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className={styles.modal} onClick={() => setShowCreateModal(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Create New League</h3>
            <form onSubmit={handleCreateLeague}>
              <div className={styles.formGroup}>
                <label htmlFor="leagueName">League Name</label>
                <input
                  id="leagueName"
                  type="text"
                  value={newLeagueName}
                  onChange={(e) => setNewLeagueName(e.target.value)}
                  placeholder="Enter league name"
                  required
                  minLength={3}
                  maxLength={50}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                  />
                  <span>Private League</span>
                </label>
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                  Create League
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showJoinModal && (
        <div className={styles.modal} onClick={() => setShowJoinModal(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Join Private League</h3>
            <form onSubmit={handleJoinLeague}>
              <div className={styles.formGroup}>
                <label htmlFor="inviteCode">Invite Code</label>
                <input
                  id="inviteCode"
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="Enter invite code"
                  required
                  minLength={6}
                  maxLength={6}
                />
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowJoinModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                  Join League
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
