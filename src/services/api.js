
import apiUtil from './apiUtil';
import DjangoRequest from './djangoRequest';

export const baseUrl = __DEV__ ? 'http://188.166.109.19' : 'http://188.166.109.19';

let api = new apiUtil(baseUrl);

let apps = {
    user: 'users',
    team: 'teams',
    club: 'clubs',
    player: 'players',
    issue: 'issues',
    country: 'countries',
    clubgalleries: 'clubgalleries',
    teamgalleries: 'teamgalleries',
    rosters: 'rosters',
};
//players/bulk patch id:[1,2] body: {currentTeam: 1, nextTeam:2}
class Api {
    club = new DjangoRequest(api, apps.club, true);
    team = new DjangoRequest(api, apps.team, true);
    player = new DjangoRequest(api, apps.player, true);
    issue = new DjangoRequest(api, apps.issue);
    user = new DjangoRequest(api, apps.user, true);
    country = new DjangoRequest(api, apps.country, true);
    clubGalleries = new DjangoRequest(api, apps.clubgalleries, true);
    teamGalleries = new DjangoRequest(api, apps.teamgalleries, true);
    roster = new DjangoRequest(api, apps.rosters, true);

    async login({ username, password }) {
        let response = await api.post(
            '/api/token/', {
                body: {
                    username,
                    password
                },
                redirectToLogin: false
            }
        );

        return response.json();
    }

    async getProfile() {
        let response = await api.get('/api/v1/profile/');
        return response.json();
    }

    async addPlayers(players, nextTeam) {
        return api.fetch('/api/v1/players/add/', {
            method: 'patch',
            query: { id: players },
            body: { nextTeam },
        });
    }

    async movePlayers(players, currentTeam, nextTeam) {
        return api.fetch('/api/v1/players/move/', {
            method: 'patch',
            query: { id: players },
            body: { currentTeam, nextTeam },
        });
    }

    async bulkMovePlayers(currentTeam, nextTeam) {
        return api.fetch('/api/v1/players/bulk/', {
            method: 'patch',
            body: { currentTeam, nextTeam },
        });
    }

    async bulkDeleteTeam(teams) {
        return api.fetch('/api/v1/teams/bulk/', {
            method: 'delete',
            query: { id: teams },
        });
    }

    async bulkDeleteClub(clubs) {
        return api.fetch('/api/v1/clubs/bulk/', {
            method: 'delete',
            query: { id: clubs },
        });
    }

    async bulkDeletePlayer(players) {
        return api.fetch('/api/v1/players/bulk/', {
            method: 'delete',
            query: { id: players },
        });
    }

    async bulkDeleteCoach(coaches) {
        return api.fetch('/api/v1/coaches/bulk/', {
            method: 'delete',
            query: { id: coaches },
        });
    }

    async uploadClubGallery(body={}) {
        return api.fetch('/api/v1/clubgalleries/', {
            method: 'post',
            body: body,
        });
    }

    async uploadTeamGallery(body={}) {
        return api.fetch('/api/v1/teamgalleries/', {
            method: 'post',
            body: body,
        });
    }

    async sendVerification(players) {
        return api.fetch('/api/v1/players/verification/', {
            method: 'post',
            query: { id: players },
        });
    }

    async movePlayersToRoster(players, rosterId, currentTeam) {
        return api.fetch('/api/v1/players/changeroster/', {
            method: 'patch',
            query: { id: players },
            body: {
                new_roster: rosterId,
                current_team: currentTeam
            },
            redirectToLogin: false
        });
    }
}

export default new Api();
