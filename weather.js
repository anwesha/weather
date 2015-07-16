$(function() {

	WeatherSelect = function (config) {
		var self 			 = this;
		self.parentContainer = $(config.parentContainerSel);
		self.dropdownCont    = self.parentContainer.find(config.dropdownContSel);
		self.dropdown	     = self.dropdownCont.find(config.dropdownSel);
		self.loadingOv		 = self.parentContainer.find('.loading-ov');
		self.type			 = config.type || 'pre';
	};

	WeatherSelect.prototype = {
		init: function () {
			var self 		= this;

			// get initial weather info
			self._updateWeatherInfo()

			// toggle dropdown open and close
			self.dropdownCont.on('click', function () {
				self.dropdownCont.toggleClass('open');
			});

			self.dropdown.on('click', self._updateWeatherInfo.bind(self));
		},

		_getWeatherDataByLocation: function (location) {
			var self     = this;
				yqlQuery = 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + location + '")',
				url      = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(yqlQuery) + '&format=json';

			$.ajax({ url: url}).done(self._parseWeatherInfoByLocation.bind(self));
		},

		_parseWeatherInfoByLocation: function (data) {
			var self 	= this,
				channel = data && data.query && data.query.results && data.query.results.channel,
				item    = channel && channel.item,
				temp,
				conditions;

			if (self.type === 'pre') {
				self.parentContainer.find('.pre-desc').html(item.description);
			} else {
				conditions = item.condition.text + ', ';
				temp = item.condition.temp + '&#176; F';
				self.parentContainer.find('.conditions .condition').html(conditions);
				self.parentContainer.find('.conditions .temp').html(temp);
				self.parentContainer.find('.loc').html(self.curLocation);
				self.parentContainer.find('.date').html(item.condition.date);
			}
			self.loadingOv.removeClass('show');
		},

		_updateWeatherInfo: function (e) {
			var self 		= this,
				target      = e && $(e.target),
				selectedLoc = target && target.data('value') || 'New York';

			if (!e) {
				self.curLocation = 'New York';
				self._getWeatherDataByLocation(selectedLoc);
				return;		
			}

			self.curLocation = target.text();
			self.dropdown.toggleClass('open');
			self.dropdown.find('.selected').removeClass('selected');
			target.addClass('selected');
			self.dropdownCont.find('.cur-location').text(target.text());

			self.loadingOv.addClass('show');
			self._getWeatherDataByLocation(selectedLoc);			
		}

	};

	var findFromDropdownConfig = {
			parentContainerSel 	: '#weather-from-dd',
			dropdownContSel   	: '.dropdown-cont',
			dropdownSel	  		: '.loc-list'
		},
		findFromDropdownConfig2   = {
			parentContainerSel 	: '#weather-from-dd-custom',
			dropdownContSel   	: '.dropdown-cont',
			dropdownSel	  		: '.loc-list',
			type				: 'custom'
		};

	new WeatherSelect(findFromDropdownConfig).init();
	new WeatherSelect(findFromDropdownConfig2).init();
});