
const validateField = (field) => {
  const message = field.parentElement.querySelector('.error-text');
  let error = '';
  if (field.name === 'name' && !field.value.trim()) error = 'Enter your name.';
  if (field.name === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) error = 'Enter an email address like name@company.com';
  if (field.name === 'need' && !field.value.trim()) error = 'Please choose what you need.';
  if (field.name === 'message' && field.value.trim().length < 20) error = 'Add a few more details so we understand the problem.';
  field.setAttribute('aria-invalid', String(Boolean(error)));
  if (message) message.textContent = error;
  return !error;
};

const initContactForm = () => {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;
  const topic = new URLSearchParams(window.location.search).get('topic');
  const select = form.querySelector('select[name="need"]');
  if (topic === 'sagea' && select) select.value = 'Enterprise AI (SAGEA)';
  const fields = [...form.querySelectorAll('input, select, textarea')].filter((field) => field.name && !field.hasAttribute('data-nonrequired'));
  fields.forEach((field) => field.addEventListener('blur', () => validateField(field)));
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const valid = fields.every(validateField);
    if (!valid) {
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector('.form-status');
    button.disabled = true;
    button.textContent = 'Sending';
    const formData = new FormData(form);
    const subject = 'New VORCO website enquiry';
    const body = `Name: ${formData.get('name') || ''}
Email: ${formData.get('email') || ''}
Company: ${formData.get('company') || ''}
Need: ${formData.get('need') || ''}

${formData.get('message') || ''}`;
    window.location.href = `mailto:info@vorco.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (status) status.textContent = 'Thanks. We have your message and will reply within two business days.';
    form.reset();
    button.disabled = false;
    button.textContent = 'Start a conversation';
  });
};

if (document.body.dataset.page === 'contact') { initContactForm(); }
