/***
 * Team WODs
 * 2016-02-04
 * Brian Duffey
 * Handles assigning of members to random teams for team WODs
 ***/
var teamWODs = (function(w, $) {
  'use strict';
  /* Variables */

  /* Functions */
  // Confirms that item should be deleted
  function confirmDelete(ev) {
    return confirm('Are you sure you want to delete this?');
  }
  // Prompts for name of member to add to team WOD
  function getName() {
    var name = '',
        tries = 0;
    while (!name) {
      name = prompt('Name:');
      name = name && name.trim();
      if (++tries > 3) break;
    }
    return name;
  }
  // Redirects to page to add member to team WOD
  function addTeamWODPerson(ev) {
    var url = '/wp-content/plugins/duffey/teamwod.php?action_mode=add&wod=' + $(ev.currentTarget).data('wod'),
        name = getName();
    if (name) {
      url += '&name=' + name;
      window.location.href = url;
    }
  }
  // On click, prompt for number of teams and then call assignTeams
  function assignTeamsClick(ev) {
    var numTeams = parseInt(prompt('How many teams?'), 10);
    if (numTeams) assignTeams(numTeams);
  }
  // Assign team logic, which randomly assigns members to a team evenly
  function assignTeams(numTeams) {
    var $people = $('.person'),
        num = $people.length,
        teamLimit = Math.ceil(num / numTeams),
        teamCt = [],
        team;
    for (var i = 0; i <= numTeams; i++) {
      teamCt[i] = 0;
    }
    $people.each(function(el, i) {
      team = 0;
      while (!team) {
        team = Math.floor(Math.random() * (numTeams)) + 1;
        if (teamCt[team] < teamLimit) {
          teamCt[team]++;
          this.value = team;
        } else {
          team = 0;
        }
      }
    });
  }
  // Redirects to page to save team inputs for future use
  function saveTeams(ev) {
    var teams = [],
        $people = $('.person'),
        url = '/wp-content/plugins/duffey/teamwod.php?wod=' + $(ev.target).data('wod') + '&teamObj=';
    $people.each(function(el, i) {
      var $person = $(this),
          id = $person.data('person'),
          team = parseInt($person.val(), 10),
          teamObj = { id: id, team: team };
      teams.push(teamObj);
    });
    window.location.href = url + JSON.stringify(teams);
  }

  /* Page setup */
  $(function() {
    $('body').on('click', '.delete', confirmDelete)
      .on('click', '.addTeamWODPerson', addTeamWODPerson)
      .on('click', '.assignTeams', assignTeamsClick)
      .on('click', '.saveTeams', saveTeams);
  });

  /* Globalize */
  return {};
}(window, jQuery));
