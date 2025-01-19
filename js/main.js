let words = [];
let changes = [];

// Grab references to elements
const initialInputsContainer = document.getElementById('initial-inputs');
const submitWordsBtn = document.getElementById('submitWords');
const activity = document.getElementById('activity');
const message = document.getElementById('message');

// When "Submit" is clicked for the initial 4 words
submitWordsBtn.addEventListener('click', () => {
  handleSubmit();
});

// Simple function to use browser's speech synthesis
function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

// Helper to show the next container and automatically "play"
function showContainer(wordKey) {
  const containerId = wordKey + '2Container';
  const container = document.getElementById(containerId);
  container.style.display = 'block';

  // Automatically click the "Play" button to speak once
  const playBtn = container.querySelector('.playBtn');
  if (playBtn) {
    playBtn.click();
  }
}

// Handle "Play" buttons (alpha2, bravo2, etc.)
const playBtns = document.querySelectorAll('.playBtn');
playBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const wordKey = btn.dataset.word; // "alpha", "bravo", ...
    const wordVal = words[wordKey];

    let speech = '';

    if (btn.id === 'play-alpha2') {
      speech += `make the word ${wordVal}`;
    }

    if (btn.id === 'play-bravo2') {
      speech += `change the ${changes.one} to a ${changes.two}`;
    }

    if (btn.id === 'play-charlie2') {
      speech += `change ${words.bravo} to ${wordVal}`;
    }

    if (btn.id === 'play-delta2') {
      speech += `change the ${changes.three} to a ${changes.four}`;
    }

    speakText(speech);
  });
});

// Handle "Check" buttons (for alpha2, bravo2, etc.)
const submitBtns = document.querySelectorAll('.submitBtn');
submitBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const wordKey = btn.dataset.word;  // e.g., "alpha"
    const inputBox = document.getElementById(wordKey + '2Input');
    const userInput = inputBox.value.trim();

    // Validate single-word letters only
    if (userInput.match(/^[A-Za-z]+$/)) {
      // Compare with original stored word
      if (userInput.toLowerCase() === words[wordKey].toLowerCase()) {
        // Show checkmark
        const checkmark = document.getElementById(wordKey + '2Checkmark');
        checkmark.style.display = 'inline-block';

        // Populate word in chain under the title so student can reference it during the next step
        const chainWords = document.querySelectorAll('.word-chain-word');
        for (let i = 0; i < chainWords.length; i++) {
          if (chainWords[i].innerHTML === '&nbsp;') {
            chainWords[i].innerHTML = userInput;
            break;
          }
        }

        // After 2 seconds, hide checkmark, hide current container, show next
        setTimeout(() => {
          checkmark.style.display = 'none';
          document.getElementById(wordKey + '2Container').style.display = 'none';

          // Move to next container
          if (wordKey === 'alpha') {
            showContainer('bravo');
            document.getElementById('bravo2Input').focus();
          } else if (wordKey === 'bravo') {
            showContainer('charlie');
            document.getElementById('charlie2Input').focus();
          } else if (wordKey === 'charlie') {
            showContainer('delta');
            document.getElementById('delta2Input').focus();
          } else if (wordKey === 'delta') {
            // Done with all four
            message.style.display = 'block';
            // After 3 seconds, hide message and reset
            setTimeout(() => {
              message.style.display = 'none';
              resetState();
            }, 3000);
          }
        }, 2000);
      } else {
        alert('That is not the correct word. Try again!');
        // Clear the input box after dismissing the alert
        inputBox.value = '';
      }
    } else {
      alert('Please complete all boxes with only letters.');
      // Clear the input box after dismissing the alert
      inputBox.value = '';
    }
  });
});

// For initial input, make the "Enter" key click the "Submit" button
const initialInputs = document.querySelectorAll('#initial-inputs input[type="text"]');
initialInputs.forEach((input) => {
  input.addEventListener('keyup', (event) => {
    if (event.key === 'Enter' && activity.style.display === 'none') {
      handleSubmit();
    }
  });
});

// For activity, make the "Enter" key click the "Check" button
const activityInputs = document.querySelectorAll('.word-container input[type="text"]');
activityInputs.forEach((input) => {
  input.addEventListener('keyup', (event) => {
    if (event.key === 'Enter' && activity.style.display === 'block') {
      // Get the container's word key from the input's ID (e.g. "alpha2Input" -> "alpha")
      const wordKey = input.id.replace('2Input', '');
      const checkBtn = document.querySelector(`.submitBtn[data-word="${wordKey}"]`);
      if (checkBtn) {
        checkBtn.click();
      }
    }
  });
});

function handleSubmit() {
  const alphaVal   = document.getElementById('alphaInput').value.trim();
  const bravoVal   = document.getElementById('bravoInput').value.trim();
  const charlieVal = document.getElementById('charlieInput').value.trim();
  const deltaVal   = document.getElementById('deltaInput').value.trim();

  const changeOne   = document.getElementById('change-one').value.trim();
  const changeTwo   = document.getElementById('change-two').value.trim();
  const changeThree = document.getElementById('change-three').value.trim();
  const changeFour  = document.getElementById('change-four').value.trim();

  // Validate each input has only letters
  if (
    alphaVal.match(/^[A-Za-z]+$/) &&
    bravoVal.match(/^[A-Za-z]+$/) &&
    charlieVal.match(/^[A-Za-z]+$/) &&
    deltaVal.match(/^[A-Za-z]+$/)
  ) {
    // Store the words
    words.alpha   = alphaVal;
    words.bravo   = bravoVal;
    words.charlie = charlieVal;
    words.delta   = deltaVal;

    changes.one   = changeOne;
    changes.two   = changeTwo;
    changes.three = changeThree;
    changes.four  = changeFour;

    // Hide the initial inputs
    initialInputsContainer.style.display = 'none';

    // Show the activity section
    activity.style.display = 'block';

    showContainer('alpha');
    document.getElementById('alpha2Input').focus();
  } else {
    alert('Please complete all boxes with only letters.');
  }
}

// Reset the page to its initial state
function resetState() {
  // Hide the activity & message
  activity.style.display = 'none';
  message.style.display = 'none';

  // Empty input boxes
  const inputs = document.querySelectorAll('input');
  inputs.forEach((input) => {
    input.value = '';
  });

  // Empty arrays
  let words = [];
  let changes = [];

  // Show the initial inputs again
  initialInputsContainer.style.display = 'block';

  // Hide all second-round containers
  document.getElementById('alpha2Container').style.display   = 'none';
  document.getElementById('bravo2Container').style.display   = 'none';
  document.getElementById('charlie2Container').style.display = 'none';
  document.getElementById('delta2Container').style.display   = 'none';

  // Empty the word chain
  const chainWords = document.querySelectorAll('.word-chain-word');
  chainWords.forEach((span) => {
    span.innerHTML = '&nbsp;';
  });
}

document.getElementById('alphaInput').focus();