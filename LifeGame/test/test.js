
(function () {
  'use strict';

  describe('Input Check', function () {
    describe('#isPositiveInt()', function () {
      it('Normal positive integers with or without one plus', function () {
      	window.__test__.isPositiveInt_("5").should.equal(true);
      	window.__test__.isPositiveInt_("+354").should.equal(true);
		window.__test__.isPositiveInt_("12474836485286549652").should.equal(true);
		window.__test__.isPositiveInt_("+12474836485286549652").should.equal(true);
      });
      it('Should return false when have a zero head', function() {
      	window.__test__.isPositiveInt_("03").should.equal(false);
		window.__test__.isPositiveInt_("0161765675726665165165198").should.equal(false);
      	window.__test__.isPositiveInt_("000021594").should.equal(false);
      });
      it('Should return false when negative and zero', function() {
      	window.__test__.isPositiveInt_("0").should.equal(false);
      	window.__test__.isPositiveInt_("-0").should.equal(false);
		window.__test__.isPositiveInt_("+0").should.equal(false);
		window.__test__.isPositiveInt_("-256").should.equal(false);
		window.__test__.isPositiveInt_("-9999999999999999").should.equal(false);
      });
      it('Should return false when have signs except plus', function() {
      	window.__test__.isPositiveInt_("$%%abds").should.equal(false);
      	window.__test__.isPositiveInt_("5+cvsd5654").should.equal(false);
      	window.__test__.isPositiveInt_("5682$%").should.equal(false);
      	window.__test__.isPositiveInt_("56+258").should.equal(false);
      	window.__test__.isPositiveInt_("0-252").should.equal(false);
      	window.__test__.isPositiveInt_("++++++++87)").should.equal(false);
      });
      it('Should return false when floating', function() {
      	window.__test__.isPositiveInt_("0.1852").should.equal(false);
      	window.__test__.isPositiveInt_(".5623").should.equal(false);
		window.__test__.isPositiveInt_("55.82").should.equal(false);
      });
    });
	describe('#isNumber()', function() {
	  it('Normal numbers', function() {
	  	window.__test__.isNumber_("235").should.equal(true);
	  	window.__test__.isNumber_("1234537645645323453225").should.equal(true);
	  	window.__test__.isNumber_("012").should.equal(true);
	  	window.__test__.isNumber_("0").should.equal(true);
	  	window.__test__.isNumber_("0.456").should.equal(true);
	  	window.__test__.isNumber_("45632.0").should.equal(true);
	  	window.__test__.isNumber_("123.").should.equal(true);
	  	window.__test__.isNumber_(".56").should.equal(true);
	  	window.__test__.isNumber_("77.89").should.equal(true);
		window.__test__.isNumber_("6564651657646.01654849840").should.equal(true);
	  });
	  it('Should return true when signed', function() {
	  	window.__test__.isNumber_("+0").should.equal(true);
	  	window.__test__.isNumber_("-0").should.equal(true);
	  	window.__test__.isNumber_("+0.1225").should.equal(true);
	  	window.__test__.isNumber_("+12.98").should.equal(true);
	  	window.__test__.isNumber_("-123").should.equal(true);
	  	window.__test__.isNumber_("+123").should.equal(true);
	  });
	  it('Should return false when not numbers', function() {
	  	window.__test__.isNumber_("546%4").should.equal(false);
	  	window.__test__.isNumber_("16bsdf").should.equal(false);
	  	window.__test__.isNumber_("+").should.equal(false);
	  	window.__test__.isNumber_("-").should.equal(false);
		window.__test__.isNumber_(".").should.equal(false);
		window.__test__.isNumber_("++++++96.5").should.equal(false);
		window.__test__.isNumber_("+.352").should.equal(false);
	  });
	});
	describe('#isCorrectFormat()', function() {
	  it('Legal inputs', function() {
	  	window.__test__.isCorrectFormat_("20", "200", "0").should.equal(true);
	  	window.__test__.isCorrectFormat_("110", "0.1", "0.855").should.equal(true);
	  	window.__test__.isCorrectFormat_("+55", "+100.01", ".38").should.equal(true);
	  });
	  it('Should return false when not numbers', function() {
	  	window.__test__.isCorrectFormat_("1abc", "10", "0.2").should.equal(false);
	  	window.__test__.isCorrectFormat_("100", "1abc.0", "0.2").should.equal(false);
	  	window.__test__.isCorrectFormat_("100", "10", "+.abc").should.equal(false);
	  	window.__test__.isCorrectFormat_("-++", "++++25", "0.2").should.equal(false);
	  	window.__test__.isCorrectFormat_("50", "10", "0.+").should.equal(false);
	  });
	  it('Should return false when out of range', function() {
	  	window.__test__.isCorrectFormat_("111", "10", "0.213").should.equal(false);
		window.__test__.isCorrectFormat_("100", "0", "0.213").should.equal(false);
		window.__test__.isCorrectFormat_("100", "10", "50").should.equal(false);
		window.__test__.isCorrectFormat_("-1000", "-10", "-0.213").should.equal(false);
		window.__test__.isCorrectFormat_("100", "-10", "21.3").should.equal(false);
		window.__test__.isCorrectFormat_("-9996", "10", "-10.8").should.equal(false);
		window.__test__.isCorrectFormat_("1000", "-999", "0.38").should.equal(false);
	  });
	});
  });
  describe('Game rules', function() {
  	describe('#judge()', function() {
  	  window.__test__.setGridCnt(20);
  	  it('Any cell with exactly 3 live neighbours becomes a live cell', function() {
  	  	window.__test__.initMap_();
  	  	window.__test__.setMapElem(0, 2, 1);
  	  	window.__test__.setMapElem(1, 3, 1);
  	  	window.__test__.setMapElem(2, 2, 1);
  	  	window.__test__.judge_(1, 2).should.equal(1);

  	  	window.__test__.initMap_();
  	  	window.__test__.setMapElem(0, 2, 1);
  	  	window.__test__.setMapElem(1, 2, 1);
  	  	window.__test__.setMapElem(4, 2, 1);
  	  	window.__test__.judge_(2, 2).should.equal(1);
  	  });
   	  it('Any cell with exactly 2 live neighbours stays live or dead', function() {
  	  	window.__test__.initMap_();
  	  	window.__test__.setMapElem(0, 2, 1);
  	  	window.__test__.setMapElem(2, 0, 1);
  	  	window.__test__.judge_(2, 2).should.equal(0);

  	  	window.__test__.initMap_();
  	  	window.__test__.setMapElem(0, 3, 1);
  	  	window.__test__.setMapElem(2, 2, 1);
  	  	window.__test__.setMapElem(2, 3, 1);
  	  	window.__test__.judge_(2, 3).should.equal(1);
  	  });
  	  it('Otherwise dead', function() {
  	  	window.__test__.initMap_();
  	  	window.__test__.setMapElem(0, 0, 1);
  	  	window.__test__.judge_(2, 2).should.equal(0);

  	  	window.__test__.initMap_();
  	  	window.__test__.setMapElem(0, 2, 1);
  	  	window.__test__.setMapElem(2, 2, 1);
  	  	window.__test__.judge_(2, 2).should.equal(0);

  	  	window.__test__.initMap_();
  	  	window.__test__.setMapElem(0, 2, 1);
  	  	window.__test__.setMapElem(1, 2, 1);
  	  	window.__test__.setMapElem(2, 0, 1);
  	  	window.__test__.setMapElem(2, 1, 1);
  	  	window.__test__.setMapElem(2, 3, 1);
		window.__test__.setMapElem(2, 2, 1);
  	  	window.__test__.judge_(2, 2).should.equal(0);
  	  });
	  it('Should not be alive on walls', function() {
  	  	window.__test__.initMap_();
  	  	window.__test__.setMapElem(2, 2, 2);
  	  	window.__test__.setMapElem(1, 2, 1);
  	  	window.__test__.setMapElem(2, 0, 1);
  	  	window.__test__.setMapElem(2, 1, 1);
  	  	window.__test__.judge_(2, 2).should.equal(2);
		
		window.__test__.initMap_();
  	  	window.__test__.setMapElem(0, 2, 2);
  	  	window.__test__.setMapElem(1, 3, 2);
  	  	window.__test__.setMapElem(2, 2, 2);
  	  	window.__test__.setMapElem(2, 1, 1);
  	  	window.__test__.judge_(2, 1).should.equal(0);
	  });
  	});
    describe('#change()', function() {
  	  window.__test__.setGridCnt(20);
      it('Extended Von Neumann, periodic', function() {
      	var data = [[0, 0], [1, 0], [2, 0], [3, 0], [0, 1], [1, 1]];
      	window.__test__.initMap_();
      	for (var idx in data) {
      		window.__test__.setMapElem(data[idx][0], data[idx][1], 1);
      	}
      	for (var k = 0; k < 64; k++) {
      		window.__test__.change_();
      	}
		
      	for (idx in data) {
      		window.__test__.getMapElem(data[idx][0], data[idx][1]).should.equal(1);
      		window.__test__.setMapElem(data[idx][0], data[idx][1], 0);
      	}
      	for (var x = 0; x < 10; x++) {
      	  for (var y = 0; y < 10; y++) {
      	    window.__test__.getMapElem(x, y).should.equal(0);
      	  }
      	}
      });
    });
  });
})();