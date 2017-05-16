# node-red-contrib-endomondo-api

<p>A node to get workouts from <a href="http://www.endomondo.com">Endomondo</a></p>
<p>The workout sets the following properties of <code>msg.payload</code>:</p>
<ul>
  <li><code>id</code> - The ID of the workout</li>
  <li><code>type</code> - The type of the activity</li>
  <li><code>duration</code> - Duration of the activity in seconds</li>
  <li><code>distance</code> - Distance of activity</li>
  <li><code>calories</code> - Calories burned during activity in kilocalories</li>
  <li><code>startime</code> - JavaScript Date object representing the start time of the activity</li>
</ul>

<p>Additional data <code>msg.data</code> are provided:</p>
<ul>
  <li><code>auth</code> - Session authentification</li>
  <li><code>workouts</code> - Array of a overview all workouts</li>
  <li><code>workout</code> - Detailed workout, selected by configured index</li>
</ul>
