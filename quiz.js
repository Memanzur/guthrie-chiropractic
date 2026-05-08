// Quiz Logic for Guthrie Chiropractic
(function () {
  var currentQuestion = 1;
  var totalQuestions = 6;
  var answers = {};

  var questions = document.querySelectorAll('.quiz-question');
  var progressSteps = document.querySelectorAll('.quiz-progress-step');
  var prevBtn = document.querySelector('.quiz-prev');
  var nextBtn = document.querySelector('.quiz-next');
  var resultsEl = document.getElementById('quizResults');
  var navEl = document.querySelector('.quiz-nav');

  // Option click handling
  document.querySelectorAll('.quiz-option').forEach(function (option) {
    option.addEventListener('click', function () {
      var input = this.querySelector('input');
      input.checked = true;
      // Remove selected from siblings
      this.closest('.quiz-options').querySelectorAll('.quiz-option').forEach(function (o) {
        o.classList.remove('selected');
      });
      this.classList.add('selected');
      answers['q' + currentQuestion] = input.value;
      nextBtn.disabled = false;
    });
  });

  function showQuestion(num) {
    questions.forEach(function (q) { q.classList.remove('active'); });
    var target = document.querySelector('[data-question="' + num + '"]');
    if (target) {
      target.classList.add('active');
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Update progress
    progressSteps.forEach(function (step) {
      var stepNum = parseInt(step.dataset.step);
      step.classList.remove('active', 'completed');
      if (stepNum < num) step.classList.add('completed');
      if (stepNum === num) step.classList.add('active');
    });

    // Update nav buttons
    prevBtn.style.visibility = num === 1 ? 'hidden' : 'visible';
    nextBtn.textContent = num === totalQuestions ? 'See My Results' : 'Next';

    // Check if this question already has an answer
    var existingAnswer = answers['q' + num];
    nextBtn.disabled = !existingAnswer;
  }

  nextBtn.addEventListener('click', function () {
    if (currentQuestion < totalQuestions) {
      currentQuestion++;
      showQuestion(currentQuestion);
    } else {
      showResults();
    }
  });

  prevBtn.addEventListener('click', function () {
    if (currentQuestion > 1) {
      currentQuestion--;
      showQuestion(currentQuestion);
    }
  });

  // Treatment recommendation engine
  var treatments = {
    adjustments: {
      name: 'Chiropractic Adjustments',
      desc: 'Traditional hands-on spinal adjustments to restore alignment and reduce nerve interference. Dr. Guthrie will tailor each session to your specific needs using diversified techniques.'
    },
    proAdjuster: {
      name: 'Pro Adjuster',
      desc: 'A computer-assisted, instrument-based approach that identifies and corrects misalignments with gentle, precise force. No cracking or popping involved, making it a great option for first-time patients or those who prefer a softer touch.'
    },
    laser: {
      name: 'Laser Therapy',
      desc: 'Cold laser technology that reduces inflammation and accelerates tissue healing. Non-invasive and pain-free, it works especially well for joint pain, soft tissue injuries, and lingering inflammation.'
    },
    decompression: {
      name: 'Spinal Decompression',
      desc: 'Non-surgical therapy that gently stretches the spine, creating negative pressure to help herniated or bulging discs retract. Particularly effective for sciatica, disc issues, and stenosis.'
    },
    flexion: {
      name: 'Flexion/Extension Therapy',
      desc: 'A gentle, pumping motion on a specialized table that increases spinal mobility and reduces disc pressure. Excellent for chronic conditions, arthritis, and stenosis.'
    },
    dropTable: {
      name: 'Drop Table Technique',
      desc: 'A low-force adjustment using a table that drops slightly during treatment, allowing effective corrections with minimal discomfort. Great for hip, lower back, and full-spine adjustments.'
    },
    eStim: {
      name: 'Electric Stimulation',
      desc: 'Therapeutic electrical currents to reduce inflammation, ease pain, and calm muscle spasms. Often paired with other treatments for enhanced recovery.'
    },
    nutrition: {
      name: 'Nutritional Counseling',
      desc: 'Personalized nutrition guidance that addresses inflammation, brain function, and endocrine balance (thyroid, adrenals). Treats pain from the inside out.'
    },
    immune: {
      name: 'Immune System Support (GAP Protocol)',
      desc: 'A protocol focused on restoring digestive health and gut flora balance to strengthen your immune system and overall wellness from the ground up.'
    }
  };

  function getRecommendation() {
    var concern = answers.q1;
    var duration = answers.q2;
    var severity = answers.q3;
    var experience = answers.q4;
    var priority = answers.q5;
    var cause = answers.q6;

    var primary, secondary, intro, education;

    // Primary recommendation based on concern + modifiers
    if (concern === 'back-pain') {
      if (severity === 'severe' || duration === 'chronic') {
        primary = treatments.decompression;
        secondary = treatments.flexion;
      } else if (priority === 'gentle' || experience === 'never') {
        primary = treatments.proAdjuster;
        secondary = treatments.dropTable;
      } else {
        primary = treatments.adjustments;
        secondary = treatments.eStim;
      }
      intro = 'Back pain is one of the most common reasons people visit our office, and the good news is we have multiple proven ways to help.';
      education = 'Back pain can stem from misaligned vertebrae, herniated discs, muscle tension, or nerve compression. Chronic back pain often involves multiple factors that compound over time. The key is identifying which structures are involved and addressing them directly rather than just masking the pain.';
    }

    else if (concern === 'neck-pain') {
      if (priority === 'gentle' || experience === 'never') {
        primary = treatments.proAdjuster;
        secondary = treatments.laser;
      } else {
        primary = treatments.adjustments;
        secondary = treatments.eStim;
      }
      intro = 'Neck pain and headaches are often connected to spinal misalignment in the cervical spine. We see this frequently and have great success treating it.';
      education = 'The cervical spine supports your head (which weighs about 10-12 pounds) and when alignment is off, it can cause tension headaches, migraines, and radiating pain. Poor posture, especially from desk work or phone use, is a major contributor. Correcting alignment and reducing muscle tension typically brings significant relief.';
    }

    else if (concern === 'joint-pain') {
      primary = treatments.laser;
      secondary = cause === 'aging' ? treatments.nutrition : treatments.eStim;
      intro = 'Joint pain responds really well to our laser therapy and supportive treatments. We can reduce inflammation and promote healing without invasive procedures.';
      education = 'Joint pain often involves inflammation of the surrounding tissues, cartilage wear, or nerve irritation. Cold laser therapy works at the cellular level to reduce inflammation and stimulate tissue repair. Combined with proper alignment of the spine and joints, most patients see meaningful improvement.';
    }

    else if (concern === 'sciatica') {
      primary = treatments.decompression;
      secondary = treatments.flexion;
      intro = 'Sciatica can be debilitating, but spinal decompression is one of the most effective non-surgical options available. Many of our patients find significant relief.';
      education = 'Sciatica happens when the sciatic nerve gets compressed, usually by a herniated disc, bone spur, or narrowed spinal canal. The pain, numbness, or tingling radiates down one leg because the nerve runs from your lower back through your hips and down each leg. Decompression therapy gently creates space for the disc to retract, taking pressure off the nerve.';
    }

    else if (concern === 'wellness') {
      if (priority === 'holistic') {
        primary = treatments.nutrition;
        secondary = treatments.adjustments;
      } else {
        primary = treatments.adjustments;
        secondary = treatments.nutrition;
      }
      intro = 'Preventive care is one of the smartest things you can do for your health. Regular adjustments and proper nutrition keep your body functioning at its best.';
      education = 'Your spine protects your nervous system, which controls every function in your body. When the spine is properly aligned, nerve signals flow freely and your body can heal and regulate itself more effectively. Combined with nutrition that supports your immune and endocrine systems, this proactive approach helps prevent problems before they start.';
    }

    else if (concern === 'digestion') {
      primary = treatments.immune;
      secondary = treatments.nutrition;
      intro = 'Digestive and immune issues are more connected to spinal health than most people realize. Our holistic approach addresses these from multiple angles.';
      education = 'Your gut is home to about 70% of your immune system. When gut flora is imbalanced, it affects digestion, inflammation levels, energy, and immune function. The GAP protocol focuses on restoring that balance while nutritional counseling supports the endocrine system. Many patients are surprised how much better they feel overall when we address these foundational issues.';
    }

    // Override for first-timers who want gentle
    if (experience === 'never' && priority === 'gentle' && concern !== 'digestion' && concern !== 'wellness') {
      secondary = primary;
      primary = treatments.proAdjuster;
      intro += ' Since this would be your first time with chiropractic care, we recommend starting with our Pro Adjuster for a gentle introduction.';
    }

    return { primary: primary, secondary: secondary, intro: intro, education: education };
  }

  function showResults() {
    // Hide quiz questions and nav
    questions.forEach(function (q) { q.classList.remove('active'); });
    navEl.style.display = 'none';

    // Mark all progress as completed
    progressSteps.forEach(function (step) { step.classList.add('completed'); });

    // Get recommendation
    var rec = getRecommendation();

    document.getElementById('resultIntro').textContent = rec.intro;
    document.getElementById('resultPrimary').innerHTML = '<strong>' + rec.primary.name + '</strong><br>' + rec.primary.desc;
    document.getElementById('resultSecondary').innerHTML = '<strong>' + rec.secondary.name + '</strong><br>' + rec.secondary.desc;
    document.getElementById('resultEducationText').textContent = rec.education;

    resultsEl.classList.add('active');

    // Scroll to results
    resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Email capture
  var emailSubmit = document.getElementById('emailSubmit');
  if (emailSubmit) {
    emailSubmit.addEventListener('click', function () {
      var emailInput = document.getElementById('resultEmail');
      var email = emailInput.value.trim();
      if (email && email.includes('@')) {
        emailSubmit.style.display = 'none';
        emailInput.style.display = 'none';
        document.getElementById('emailConfirm').style.display = 'block';
      }
    });
  }
})();
