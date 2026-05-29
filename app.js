document.addEventListener('DOMContentLoaded', () => {
  
  /* --- 1. FIXED HEADER & MOBILE MENU --- */
  const header = document.querySelector('.header');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  });

  // Mobile menu toggle
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const spans = menuToggle.querySelectorAll('span');
    spans[0].style.transform = navMenu.classList.contains('active') ? 'rotate(45deg) translate(6px, 6px)' : 'none';
    spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
    spans[2].style.transform = navMenu.classList.contains('active') ? 'rotate(-45deg) translate(5deg, -5px)' : 'none';
  });

  // Close mobile menu on click nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      const spans = menuToggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });


  /* --- 2. MODALS SYSTEM --- */
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('.modal-close');
  const modalOverlay = document.querySelectorAll('.modal-overlay');

  // Open modal helper
  window.openModal = function(modalId, options = {}) {
    const targetModal = document.getElementById(modalId);
    if (!targetModal) return;

    // Reset forms inside if any
    const form = targetModal.querySelector('form');
    if (form) form.reset();

    // Custom option handling (e.g. prefill values)
    if (options.requestType && targetModal.querySelector('#requestType')) {
      targetModal.querySelector('#requestType').value = options.requestType;
    }
    if (options.orderType && targetModal.querySelector('#orderType')) {
      targetModal.querySelector('#orderType').value = options.orderType;
    }

    targetModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Close all modals helper
  function closeAllModals() {
    modals.forEach(modal => modal.classList.remove('active'));
    document.body.style.overflow = '';
  }

  closeButtons.forEach(btn => btn.addEventListener('click', closeAllModals));
  modalOverlay.forEach(overlay => overlay.addEventListener('click', closeAllModals));

  // Esc key close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });


  /* --- 3. SEGMENTATION SCROLL / PREFILL --- */
  window.handleSegmentClick = function(targetSectionId, prefillType) {
    const element = document.getElementById(targetSectionId);
    if (element) {
      // Smooth scroll
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };


  /* --- 4. TABS FOR PROCESS AND REVIEWS --- */
  window.switchTab = function(tabName, event, containerClass) {
    const buttons = event.currentTarget.parentNode.children;
    const contents = document.querySelectorAll(`.${containerClass}`);

    // Update active buttons
    for (let btn of buttons) {
      btn.classList.remove('active');
    }
    event.currentTarget.classList.add('active');

    // Update active contents
    contents.forEach(content => {
      content.classList.remove('active');
      if (content.dataset.tab === tabName) {
        content.classList.add('active');
      }
    });
  };


  /* --- 5. PORTFOLIO FILTERING --- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      portfolioItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });


  /* --- 6. FAQ ACCORDION --- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-panel').style.maxHeight = null;
      });

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });


  /* --- 7. QUIZ CALCULATOR LOGIC --- */
  let currentStep = 1;
  const totalSteps = 6;
  const quizSteps = document.querySelectorAll('.quiz-step-content');
  const progressFill = document.getElementById('quizProgress');
  const progressText = document.getElementById('quizProgressText');
  const prevBtn = document.getElementById('quizPrev');
  const nextBtn = document.getElementById('quizNext');
  
  // Data holder
  const quizData = {
    clientType: '',
    service: '',
    volume: '',
    material: '',
    deadline: '',
    name: '',
    phone: ''
  };

  // Option selection logic
  const optionCards = document.querySelectorAll('.quiz-option-card');
  optionCards.forEach(card => {
    card.addEventListener('click', () => {
      const step = card.closest('.quiz-step-content');
      const stepNum = parseInt(step.dataset.step);

      // Select option
      const siblingOptions = step.querySelectorAll('.quiz-option-card');
      siblingOptions.forEach(opt => opt.classList.remove('selected'));
      card.classList.add('selected');

      const value = card.dataset.value;

      // Save choices
      if (stepNum === 1) {
        quizData.clientType = value;
        // Dynamic step 2 based on client type
        updateStep2Options(value);
      } else if (stepNum === 2) {
        quizData.service = value;
      } else if (stepNum === 3) {
        quizData.volume = value;
      } else if (stepNum === 4) {
        quizData.material = value;
      } else if (stepNum === 5) {
        quizData.deadline = value;
      }

      // Auto advance for choice-based steps (except final steps)
      if (stepNum < 5) {
        setTimeout(() => {
          goToStep(stepNum + 1);
        }, 300);
      }
    });
  });

  function updateStep2Options(clientType) {
    const individualOptions = document.getElementById('quizOptsIndividual');
    const businessOptions = document.getElementById('quizOptsBusiness');

    if (clientType === 'individual') {
      individualOptions.style.display = 'grid';
      businessOptions.style.display = 'none';
      // Clear previous selection if any
      individualOptions.querySelectorAll('.quiz-option-card').forEach(c => c.classList.remove('selected'));
    } else {
      individualOptions.style.display = 'none';
      businessOptions.style.display = 'grid';
      // Clear previous selection if any
      businessOptions.querySelectorAll('.quiz-option-card').forEach(c => c.classList.remove('selected'));
    }
    quizData.service = '';
  }

  function updateProgressBar() {
    const percent = Math.min((currentStep / totalSteps) * 100, 100);
    progressFill.style.width = `${percent}%`;
    progressText.textContent = `Шаг ${currentStep} из ${totalSteps}`;
  }

  function goToStep(stepNum) {
    if (stepNum < 1 || stepNum > totalSteps) return;

    // Validate if user has selected option before proceeding
    if (stepNum > currentStep) {
      if (currentStep === 1 && !quizData.clientType) {
        alert('Пожалуйста, выберите один из вариантов.');
        return;
      }
      if (currentStep === 2 && !quizData.service) {
        alert('Пожалуйста, укажите вид услуги.');
        return;
      }
      if (currentStep === 3 && !quizData.volume) {
        alert('Пожалуйста, укажите примерный тираж.');
        return;
      }
      if (currentStep === 4 && !quizData.material) {
        alert('Пожалуйста, выберите вариант с тканью.');
        return;
      }
      if (currentStep === 5 && !quizData.deadline) {
        alert('Пожалуйста, укажите желаемые сроки.');
        return;
      }
    }

    quizSteps.forEach(step => {
      step.classList.remove('active');
      if (parseInt(step.dataset.step) === stepNum) {
        step.classList.add('active');
      }
    });

    currentStep = stepNum;
    updateProgressBar();

    // Nav buttons styling
    if (currentStep === 1) {
      prevBtn.style.visibility = 'hidden';
    } else {
      prevBtn.style.visibility = 'visible';
    }

    if (currentStep === totalSteps) {
      nextBtn.style.display = 'none';
    } else {
      nextBtn.style.display = 'inline-flex';
    }
  }

  // Quiz Navigation Buttons Click
  prevBtn.addEventListener('click', () => {
    goToStep(currentStep - 1);
  });

  nextBtn.addEventListener('click', () => {
    goToStep(currentStep + 1);
  });

  // Final submit for Quiz
  const quizForm = document.getElementById('quizForm');
  quizForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('quizName').value.trim();
    const phoneInput = document.getElementById('quizPhone').value.trim();

    if (!nameInput || !phoneInput) {
      alert('Пожалуйста, заполните контактные данные.');
      return;
    }

    quizData.name = nameInput;
    quizData.phone = phoneInput;

    // Simulation of API send
    console.log('Quiz data submitted:', quizData);

    // Show Thank you modal
    closeAllModals();
    openModal('successModal');

    // Reset Quiz
    resetQuiz();
  });

  function resetQuiz() {
    currentStep = 1;
    quizData.clientType = '';
    quizData.service = '';
    quizData.volume = '';
    quizData.material = '';
    quizData.deadline = '';
    quizData.name = '';
    quizData.phone = '';

    optionCards.forEach(card => card.classList.remove('selected'));
    quizForm.reset();
    goToStep(1);
  }


  /* --- 8. SUBMIT FORMS OVERVIEW --- */
  const forms = document.querySelectorAll('form:not(#quizForm)');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simple validation for input elements inside
      const requiredInputs = form.querySelectorAll('[required]');
      let isValid = true;
      
      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = 'red';
        } else {
          input.style.borderColor = '';
        }
      });

      if (!isValid) return;

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Отправка...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        // Show success modal
        closeAllModals();
        openModal('successModal');
        
        // Reset form
        form.reset();
      }, 1000);
    });
  });

});
