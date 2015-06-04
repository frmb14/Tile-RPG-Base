<?php $title='Tile RPG Base'; include(__DIR__ . '/../inc/header.php'); ?>
<script data-main="js/script" src="js/lib/require.js"></script>
<div id='flash'>
	<p>Move with <kbd>&nbsp;&#9668;&nbsp;</kbd> <kbd>&nbsp;&#9650;&nbsp;</kbd> <kbd>&nbsp;&#9660;&nbsp;</kbd> <kbd>&nbsp;&#9658;&nbsp;</kbd> and shoot with <kbd>&nbsp;1&nbsp;</kbd>. 
	<br/>Accept and turn in quests by being within interaction range of the quest giver and press <kbd>&nbsp;ENTER&nbsp;</kbd> </p>
	<canvas id='gameArea' width='960' height='480'>
		Your browser does not support the element HTML5 Canvas.
	</canvas>
</div>

<?php $path=__DIR__; include(__DIR__ . '/../inc/footer.php'); ?>