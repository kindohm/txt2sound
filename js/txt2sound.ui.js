(function () {

	var playing = false;
	var fps = 15;
	var showHideDuration = 200;
	var showingTweets = false;
	var twitterText = '';
	
	var presetDefault = {"name":"default","key":"c","drums":true,"tempo":240,"octave":2,"waveShape":"sine","attack":10,"release":500,"noteLength":100,"lfoWaveShape":"sine","lfoFrequency":50,"lfoAmount":0,"reverbWet":1,"reverbDry":0.7,"reverbSize":0.8};
	var presetBitsAndBytes = {"name":"bits and bytes","key":"g","drums":false,"tempo":537,"octave":4,"waveShape":"square","attack":6,"release":20,"noteLength":50,"lfoWaveShape":"sine","lfoFrequency":162,"lfoAmount":0.11,"reverbWet":0.13,"reverbDry":1,"reverbSize":0.03};
	var presetAurora = {"name":"aurora","key":"amin","drums":false,"tempo":80,"octave":2,"waveShape":"sine","attack":20,"release":290,"noteLength":50,"lfoWaveShape":"sine","lfoFrequency":36.5,"lfoAmount":0,"reverbWet":1,"reverbDry":0.13,"reverbSize":0.96};
	var presetDistantPhones = {"name":"distant phones","key":"f","drums":false,"tempo":214,"octave":3,"waveShape":"triangle","attack":35,"release":407,"noteLength":580,"lfoWaveShape":"square","lfoFrequency":4.7,"lfoAmount":0.05,"reverbWet":0.24,"reverbDry":1,"reverbSize":0.91};
	var presetHappyBugs = {"name":"happy bugs","key":"c","drums":false,"tempo":248,"octave":3,"waveShape":"sawtooth","attack":45,"release":146,"noteLength":580,"lfoWaveShape":"invSawtooth","lfoFrequency":1.4,"lfoAmount":0.26,"reverbWet":0.2,"reverbDry":1,"reverbSize":0.04};
	var presetRoboBirds = {"name":"robo birds","key":"d","drums":true,"tempo":483,"octave":5,"waveShape":"sine","attack":26,"release":41,"noteLength":192,"lfoWaveShape":"sawtooth","lfoFrequency":61.4,"lfoAmount":0.73,"reverbWet":0.38,"reverbDry":1,"reverbSize":0.12};
	var presetRobotOnBreak = {"name":"robot on a break","key":"c","drums":false,"tempo":443,"octave":4,"waveShape":"triangle","attack":1,"release":1,"noteLength":745,"lfoWaveShape":"sine","lfoFrequency":145.8,"lfoAmount":0.83,"reverbWet":0.79,"reverbDry":0.19,"reverbSize":0.01};
	
	var presets = [presetDefault, presetBitsAndBytes, presetAurora, presetDistantPhones, presetHappyBugs, presetRoboBirds, presetRobotOnBreak];
		
	var textInputKeyup = function () {
		txt2sound.setText($('#textInput').val());
	};
	
	var setPlayButtonText = function (newText) {
		$('#playButton').text(newText);
	};

	var playButtonClick = function () {
		if (!playing) {
			txt2sound.play();
			setPlayButtonText('Stop');
		} else {
			txt2sound.stop();
			setPlayButtonText('Play');
		}
		playing = !playing;
	};
	
	var charChanged = function () {
		var prevChars = txt2sound.getPreviousChars();
		var currentChar = txt2sound.getCurrentChar();
		var nextChars = txt2sound.getNextChars();
		var result = '';
		
		for (var i = 0; i < prevChars.length; i++) {
			result += prevChars[i] != undefined ? prevChars[i] : ' ';
		}
		
		$('#prevChars').text(result);
		$('#currentChar').text(currentChar);
	};
	
	var getPreset = function () {
	
		var preset = {};
		
		preset.tempo = txt2sound.transformer.tempo;
		preset.octave = txt2sound.transformer.octave;
		preset.waveShape = txt2sound.transformer.waveShape;
		preset.attack = txt2sound.transformer.noteAttack;
		preset.release = txt2sound.transformer.noteRelease;
		preset.noteLength = txt2sound.transformer.noteLength;
		preset.lfoWaveShape = txt2sound.transformer.lfoWaveShape;
		preset.lfoFrequency = txt2sound.transformer.lfoFrequency;
		preset.lfoAmount = txt2sound.transformer.lfoAmount;
		preset.reverbWet = txt2sound.transformer.reverb.wet;
		preset.reverbDry = txt2sound.transformer.reverb.dry;
		preset.reverbSize = txt2sound.transformer.reverb.roomSize;
		preset.drums = txt2sound.transformer.drumsEnabled;
		preset.key = txt2sound.transformer.key;
		preset.name = '';
		
		//var encoded = $.toJSON( thing );
		//var name = $.evalJSON( encoded ).plugin;

		var json = $.toJSON( preset );
		$('#presetJson').val(json);
		$('#presetJson').show();
	
	};
	
	var loadPreset = function (preset) {
	
		txt2sound.transformer.setTempo(preset.tempo);
		txt2sound.transformer.octave = preset.octave;
		txt2sound.transformer.waveShape = preset.waveShape;
		txt2sound.transformer.noteAttack = preset.attack;
		txt2sound.transformer.noteRelease = preset.release;
		txt2sound.transformer.noteLength = preset.noteLength;
		txt2sound.transformer.lfoWaveShape = preset.lfoWaveShape;
		txt2sound.transformer.lfoFrequency = preset.lfoFrequency;
		txt2sound.transformer.lfoAmount = preset.lfoAmount;
		txt2sound.changeReverbSize(preset.reverbSize);
		txt2sound.transformer.reverb.wet = preset.reverbWet;
		txt2sound.transformer.reverb.dry = preset.reverbDry;
		txt2sound.transformer.changeKey(preset.key);
		txt2sound.transformer.drumsEnabled = preset.drums;
		
		$('#tempoSlider').slider( { value: preset.tempo } );
		$('#octaveSlider').slider( { value: preset.octave } );
		$('#waveShapeSelect').val(preset.waveShape);
		$('#attackSlider').slider( { value: preset.attack } );
		$('#releaseSlider').slider( { value: preset.release } );
		$('#noteLengthSlider').slider( { value: preset.noteLength } );
		$('#lfoWaveShapeSelect').val(preset.lfoWaveShape);
		$('#lfoHzSlider').slider( { value: preset.lfoFrequency } );
		$('#lfoAmountSlider').slider( { value: preset.lfoAmount } );
		$('#reverbSizeSlider').slider( { value: preset.reverbSize } );
		$('#reverbWetSlider').slider( { value: preset.reverbWet } );
		$('#reverbDrySlider').slider( { value: preset.reverbDry } );
		preset.drums ? $('#drumsCheckBox').attr('checked', 'true') : $('#drumsCheckBox').removeAttr('checked');
		
		txt2sound.transformer.samplesLeft = 0;
		txt2sound.transformer.drumSamplesLeft = 0;
	};

	$(document).ready(function (){
	
		$('#playButton').click(playButtonClick);
		$('#presetButton').click(getPreset);
		$('#textInput').live('keyup', textInputKeyup);
		textInputKeyup();
		
		txt2sound.charChanged(charChanged);
		
		for (var i = 0; i < presets.length; i++) {
			var option = $('<option>');
			option.attr('value', i);
			option.text(presets[i].name);
			$('#presetSelect').append(option);
		}
		
		$('#presetSelect').change(function () {
			loadPreset( presets[ parseInt($('#presetSelect').val() ) ] );
		});
		
		txt2sound.transformer.drumsEnabled ? $('#drumsCheckBox').attr('checked', 'true') : false;
		
		$('#drumsCheckBox').change(function () {
			txt2sound.transformer.drumsEnabled = $('#drumsCheckBox').attr('checked');
		});
		
		$('#lfoHzSlider').slider( {
			min: 0,
			max: 200,
			step: .1,
			value: txt2sound.transformer.lfoFrequency,
			change: function (event, ui) { txt2sound.transformer.lfoFrequency = ui.value; },
			slide: function (event, ui) { txt2sound.transformer.lfoFrequency = ui.value; }
		});
		
		$('#lfoAmountSlider').slider( {
			min: 0,
			max: 1,
			step: .01,
			value: txt2sound.transformer.lfoAmount,
			change: function (event, ui) { txt2sound.transformer.lfoAmount = ui.value; },
			slide: function (event, ui) { txt2sound.transformer.lfoAmount = ui.value; }
		});
		
		$('#waveShapeSelect').change(function () {
			txt2sound.transformer.waveShape = $('#waveShapeSelect').val();
		});

		$('#lfoWaveShapeSelect').change(function () {
			txt2sound.transformer.lfoWaveShape = $('#lfoWaveShapeSelect').val();
		});

		$('#octaveSlider').slider({
			min: 0,
			max: 6,
			value: txt2sound.transformer.octave,
			step: 1,
			change: function (event, ui) { txt2sound.transformer.setOctave(ui.value); },
			slide: function (event, ui) { txt2sound.transformer.setOctave(ui.value); } 
		});

		$('#reverbDrySlider').slider({
			min: 0,
			max: 1,
			value: txt2sound.transformer.reverb.dry,
			step: .01,
			change: function (event, ui) { txt2sound.transformer.reverb.dry = ui.value; },
			slide: function (event, ui) { txt2sound.transformer.reverb.dry = ui.value; } 
		});

		$('#reverbWetSlider').slider({
			min: 0,
			max: 1,
			value: txt2sound.transformer.reverb.wet,
			step: .01,
			change: function (event, ui) { txt2sound.transformer.reverb.wet = ui.value; },
			slide: function (event, ui) { txt2sound.transformer.reverb.wet = ui.value; } 
		});

		$('#reverbSizeSlider').slider({
			min: 0,
			max: 1,
			value: txt2sound.transformer.reverb.roomSize,
			step: .01,
			change: function (event, ui) { txt2sound.changeReverbSize(ui.value); }
		});

		$('#noteLengthSlider').slider({
			min: 50,
			max: 10000,
			value: txt2sound.transformer.noteLength,
			step: 1,
			change: function (event, ui) { txt2sound.transformer.noteLength = ui.value; },
			slide: function (event, ui) { txt2sound.transformer.noteLength = ui.value; } 
		});

		$('#attackSlider').slider({
			min: 1,
			max: 1000,
			value: txt2sound.transformer.noteAttack,
			step: 1,
			change: function (event, ui) { txt2sound.transformer.noteAttack = ui.value; },
			slide: function (event, ui) { txt2sound.transformer.noteAttack = ui.value; } 
		});
		
		$('#releaseSlider').slider({
			min: 1,
			max: 1000,
			value: txt2sound.transformer.noteRelease,
			step: 1,
			change: function (event, ui) { txt2sound.transformer.noteRelease = ui.value; },
			slide: function (event, ui) { txt2sound.transformer.noteRelease = ui.value; } 
		});

		$('#tempoSlider').slider({
			min: 40,
			max: 1000,
			value: txt2sound.transformer.tempo,
			step: 1,
			change: function (event, ui) { txt2sound.transformer.setTempo(ui.value); },
			slide: function (event, ui) { txt2sound.transformer.setTempo(ui.value); } 
		});
		
		$('#searchTwitterButton').click(function () {
			txt2sound.stop();
			txt2sound.setText(twitterText);
			setPlayButtonText('Play');
			playing = false;
			$('#searchTwitterButton').hide(showHideDuration);
			$('#basicInput').hide(showHideDuration, function () {
				$('#twitterInput').show(showHideDuration);
				$('#basicInputButton').show(showHideDuration);
				$('#twitterResultsSection').show(showHideDuration);
			});
		});
		
		$('#basicInputButton').click(function () {
			txt2sound.stop();
			playing = false;
			txt2sound.setText($('#textInput').val());
			setPlayButtonText('Play');
			
			$('#twitterMessage').hide();
			$('#basicInputButton').hide(showHideDuration);
			$('#twitterResultsSection').hide();

			$('#twitterInput').hide(showHideDuration, function () {
				$('#basicInput').show(showHideDuration);
				$('#searchTwitterButton').show(showHideDuration);
			});

		});
		
		$('#advancedSettingsButton').click(function () {
			$('#advancedSettingsButton').hide(showHideDuration);
			$('#basicSettings').hide(showHideDuration, function () { 
				$('#advancedSettings').show( showHideDuration);
				$('#basicSettingsButton').show();
			});
		});
		
		$('#basicSettingsButton').click(function () {
			$('#basicSettingsButton').hide(showHideDuration);
			
			$('#advancedSettings').hide(showHideDuration, function () {
				$('#basicSettings').show(showHideDuration);
				$('#advancedSettingsButton').show();
			});
		});

		$('#showTwitterResultsButton').click(function () {
			showingTweets = !showingTweets;
			if (showingTweets) {
				$('#showTwitterResultsButton').text('Hide Tweets');
				$('#twitterResults').show();
			} else {
				$('#showTwitterResultsButton').text('Show Tweets');
				$('#twitterResults').hide();
			}
		});
		
		$('#twitterSearchInput').keyup(function (event) {
			if (event.which === 13 && $('#twitterSearchInput').val().length > 0) {
				$('#showTwitterResultsButton').hide();
				$('#twitterSearchInput').attr('disabled', true);
				$('#playButton').attr('disabled', true);
				var uri = 'http://search.twitter.com/search.json?q=' + 
					$('#twitterSearchInput').val().replace('#', '%23') + '&callback=?';
				
				$('#twitterResults').empty();
				
				$.getJSON(uri, function (data) {
					$('#twitterSearchInput').removeAttr('disabled');
					$('#playButton').removeAttr('disabled');
					$('#showTwitterResultsButton').show();
					
					twitterText = '';
					if (data.results.length > 0) {
						$.each(data.results, function(i, tweet) {
							if (tweet.text !== undefined) {
								twitterText += tweet.from_user + ' ' + tweet.text.replace('&lt;', '\<').replace('&gt;', '\>') + ' ';
							}
							// profile_image_url
							var tweetDiv = $('<div class=\'tweet\'>');
							tweetDiv.append('<img src=\'' + tweet.profile_image_url + '\'/>');
							tweetDiv.append('<div class=\'tweetContent\'><strong>' + tweet.from_user + '</strong>&nbsp;' + tweet.text + '</div><div class=\'clear\'></div>');
							tweetDiv.append();
							
							$('#twitterResults').append(tweetDiv);
							
						});
						$('#twitterMessage').text(data.results.length + ' results found. Click Play to listen!');
						$('#twitterMessage').show();
						
						txt2sound.setText(twitterText);
						txt2sound.transformer.position = 0;
					}
				});
			}
		});
		
		
		
	});
	

})();