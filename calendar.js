(function (datePicker) {
    var JsDatePicker = function (config) {
        var _this = this;
        _this.displayFormat = config['displayFormat'] || 'MM/dd/yyyy',
        _this.valueFormat = config['valueFormat'] || "yyyy-MM-dd",
        _this.value = config['value'],
        _this.element = config['element']
    }
    JsDatePicker.prototype.prepareDatePicker = function () {

    }
})(window.datePicker || (window.datePicker = {}));

var dataGrid;
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//var 
var currentDate = new Date();
var today = {
    Day: currentDate.getDate(),
    Month: currentDate.getMonth(),
    Year: currentDate.getFullYear()
}, startDay, currentCal = {};
var displayCal = new Date();
var typeCalendar = {
    fullCalendar: true,
    monthCalendar: false,
    yearCalendar: false
};
var _datePicker = document.getElementsByClassName('js-dates')[0];
var _datePickerBody = '';
var _couter = 0, _rowCell = 0, tr, td, addData;
var createElement = function (tagName) {
    return document.createElement(tagName);
}
var prepareDatePicker = function () {
    tr = '';
    _couter = 0;
    _rowCell = 0;
    if (typeCalendar.yearCalendar) {
        var a = displayCal.getFullYear();
        var b = a % 10;
        a = a - b + 1;
        _couter = a;
        displayCal.setYear(a);
    }
    displayCal.setDate(1);
    startDay = displayCal.getDay();
    endData = displayCal.getMonth();
    currentCal = {
        startDay: displayCal.getDay(),
        Month: displayCal.getMonth(),
        Year: displayCal.getFullYear()
    }
    if (typeCalendar.fullCalendar) {
        currentCal['endDay'] = (function () {
            displayCal.setMonth(currentCal.Month + 1);
            displayCal.setDate(1);
            initialDay = displayCal.getDay();
            displayCal.setYear(currentCal.Year);
            displayCal.setMonth(currentCal.Month);
            return initialDay;
        })();
    }
    if (_datePickerBody) {
        _datePickerBody.remove();
    }
    var _showColor = false;
    var picker = {};
    _datePickerBody = createElement('tbody');
    _datePicker.appendChild(_datePickerBody);
    if (_datePicker.className.indexOf('Calendar') != -1) {
        _datePicker.className = _datePicker.className.replace(/\s.{4,5}Calendar/, '')
    }
    if (typeCalendar.yearCalendar) {
        _showColor = true;
        _datePicker.className += ' yearCalendar';
        picker = { start: 0, end: 1, loopCount: _couter + 9, loopReset: 3, highlight: today.Year };
        document.getElementsByClassName('displayMonth')[0].parentNode.style.display = '';
        document.getElementsByClassName('displayMonth')[0].textContent = _couter;
        document.getElementsByClassName('displayYear')[0].textContent = _couter + 9;
    }
    else if (typeCalendar.monthCalendar) {
        if (today.Year == currentCal.Year) {
            _showColor = true;
        }
        _datePicker.className += ' monthCalendar';
        document.getElementsByClassName('displayMonth')[0].parentNode.style.display = 'none';
        picker = { start: 0, end: 0, loopCount: 12, loopReset: 3, highlight: today.Month, };
        document.getElementsByClassName('displayYear')[0].textContent = currentCal['Year'];
    }
    else {
        if (today.Month == currentCal.Month && today.Year == currentCal.Year) {
            _showColor = true;
        }
        picker = { start: startDay, end: currentCal['endDay'], loopCount: 28, loopReset: 7, highlight: today.Day - 1 };
        document.getElementsByClassName('displayMonth')[0].parentNode.style.display = '';
        document.getElementsByClassName('displayMonth')[0].textContent = months[currentCal['Month']];
        document.getElementsByClassName('displayYear')[0].textContent = currentCal['Year'];
    }

    for (var i = 0; true; i++) {
        if (i == picker.start) {
            addData = true;
        }
        else if (_couter >= picker.loopCount && _rowCell == picker.end) {
            addData = false;
        }
        if (_rowCell == 0) {
            if (tr) {
                _datePickerBody.appendChild(tr);
                if (!addData) {
                    return false;
                }
            }
            tr = createElement('tr');
        }
        td = createElement('td');
        if (addData) {
            td.className = 'date--cell'
            if (_showColor && picker.highlight == _couter) {
                td.className += ' today';
            }
            if (typeCalendar.yearCalendar) {
                td.originalValue = td.textContent = _couter++;
            }
            else if (typeCalendar.monthCalendar) {
                td.originalValue = _couter;
                td.textContent = months[_couter++];
            }
            else {
                td.originalValue = td.textContent = ++_couter;
            }
            td.addEventListener('click', function () {
                onSelect(this.originalValue);
            });
        }
        tr.appendChild(td);
        _rowCell++;
        if (_rowCell == picker.loopReset) {
            _rowCell = 0;
        }
    }
}

var onSelect = function (value) {
    var displayElement = document.getElementsByClassName('selectedDate')[0]
    if (typeCalendar.yearCalendar) {
        typeCalendar.yearCalendar = false;
        if (typeCalendar.monthCalendar || typeCalendar.fullCalendar) {
            typeCalendar.monthCalendar = true;
            displayCal.setYear(value);
            prepareDatePicker();
            return true;
        }
        displayElement.textContent = value;
    }
    else if (typeCalendar.monthCalendar) {
        typeCalendar.monthCalendar = false;
        if (typeCalendar.fullCalendar) {
            displayCal.setMonth(value);
            prepareDatePicker();
            return true;
        }
        displayElement.textContent = months[value - 1] + ',' + displayCal.getFullYear();
    }
    else {
        displayElement.textContent = new Date((displayCal.getMonth() + 1) + '/' + value + '/' + displayCal.getFullYear());
    }
    document.getElementsByClassName('js-date-picker')[0].style.display = 'none';
    document.getElementsByClassName('backBtn')[0].style.display = 'block';
    document.getElementsByClassName('selectedDate')[0].style.display = 'block';
};

var previousMonth = function () {
    if (typeCalendar.yearCalendar) {
        displayCal.setYear(displayCal.getFullYear() - 10);
    }
    else if (typeCalendar.monthCalendar) {
        displayCal.setYear(displayCal.getFullYear() - 1);
    }
    else {
        var prevMonth = displayCal.getMonth() - 1;
        if (prevMonth < 0) {
            prevMonth = 11;
            var prevYear = displayCal.getFullYear() - 1;
            displayCal.setYear(prevYear);
        }
        displayCal.setMonth(prevMonth);
    }
    prepareDatePicker();
}
var nextMonth = function () {
    if (typeCalendar.yearCalendar) {
        displayCal.setYear(displayCal.getFullYear() + 10);
    }
    else if (typeCalendar.monthCalendar) {
        displayCal.setYear(displayCal.getFullYear() + 1);
    }
    else {
        var nextMonth = displayCal.getMonth() + 1;
        if (nextMonth == 12) {
            nextMonth = 0;
            var nextYear = displayCal.getFullYear() + 1;
            displayCal.setYear(nextYear);
        }
        displayCal.setMonth(nextMonth);
    }
    prepareDatePicker();
}
var displayMonthCal = function () {
    if (typeCalendar.yearCalendar) {
        return false;
    }
    typeCalendar.monthCalendar = true;
    prepareDatePicker();
}
var displayYearCal = function () {
    if (typeCalendar.yearCalendar) {
        return false;
    }
    typeCalendar.yearCalendar = true;
    prepareDatePicker();
}

var showCalendar = function () {
    document.getElementsByClassName('selectedDate')[0].style.display = 'none';
    document.getElementsByClassName('backBtn')[0].style.display = 'none';
    document.getElementsByClassName('js-date-picker')[0].style.display = "block";
};

prepareDatePicker();

