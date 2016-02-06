(function() {
  'use strict';

  function AskBipulController($location, $q, $scope) {
    var DEFAULT_QUESTION = 'how long before we IPO?';
    var INDIAN_VOICE_NAME = decodeURIComponent(
      "Google%20%E0%A4%B9%E0%A4%BF%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A5%80");
    var INDIAN_VOICE;
    
    $scope.answerInProgress = false;
    $scope.questionLead = 'Hey Bipul,';
    $scope.askQuestion = askQuestion;
    $scope.stopAnswer = stopAnswer;
    
    _getQuestionFromUrl();
    
    window.speechSynthesis.onvoiceschanged = _findIndianVoice;
    
    function askQuestion() {
      var question = _makeQuestion();
      var questionAskDone = _synthesizeVoice(question);
      
      questionAskDone.then(_answerTruthfully);
    }
    
    function stopAnswer() {
      $scope.answerInProgress = false;
    }
    
    function _answerTruthfully() {
      $scope.answerInProgress = true;
    }
    
    function _getQuestionFromUrl() {
      var questionMatch = "question=";
      var absUrl = $location.absUrl();
      var questionIndex = absUrl.indexOf(questionMatch);
      
      if (questionIndex > 0) {
        var endIndex = absUrl.length - 1;
        $scope.question = window.decodeURI(
          absUrl.substring(questionIndex + questionMatch.length, endIndex));
      } else {
        $scope.question = DEFAULT_QUESTION;
      }
    }
    
    function _findIndianVoice() {
      INDIAN_VOICE = window.speechSynthesis
        .getVoices()
        .filter(function(voice) {
          return voice.name === INDIAN_VOICE_NAME; 
        })[0];
    }
    
    function _makeQuestion() {
      return $scope.questionLead + ' ' + $scope.question;
    }
    
    function _synthesizeVoice(msg) {
      var voiceDone = $q.defer();
      var utterance = new window.SpeechSynthesisUtterance(msg);
      utterance.voice = INDIAN_VOICE;
      utterance.onend = voiceDone.resolve;
      
      window.speechSynthesis.speak(utterance);
      return voiceDone.promise;
    }
  }
  
  angular
    .module('askBipul', [])
    .controller('AskBipulController', AskBipulController);
})();
