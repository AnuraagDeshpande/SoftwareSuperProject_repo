describe('Signup Form Tests', function() {
    beforeEach(function(done) {
      // Load your actual HTML file
      fetch('signup.html')
        .then(response => response.text())
        .then(html => {
          document.body.innerHTML = html;
          done();
        });
    });
  
 // Load your validation script
 require('../../../scripts/signup-validation');
});

describe('Form Elements', function() {
  it('should have all required form fields', function() {
    expect(document.getElementById('full-name')).not.toBeNull();
    expect(document.getElementById('username')).not.toBeNull();
    expect(document.getElementById('email')).not.toBeNull();
    expect(document.getElementById('password')).not.toBeNull();
  });

  it('should have required attributes on fields', function() {
    const fullName = document.getElementById('full-name');
    expect(fullName.hasAttribute('required')).toBeTrue();
    expect(fullName.getAttribute('type')).toBe('text');
    
    const email = document.getElementById('email');
    expect(email.getAttribute('type')).toBe('email');
  });
});

describe('Form Validation', function() {
  it('should prevent submission when full name is empty', function() {
    const form = document.getElementById('signup-form');
    const event = new Event('submit');
    spyOn(event, 'preventDefault');
    
    // Set empty full name but fill other fields
    document.getElementById('full-name').value = '';
    document.getElementById('username').value = 'testuser';
    document.getElementById('email').value = 'test@example.com';
    document.getElementById('password').value = 'Password123';
    
    form.dispatchEvent(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should accept valid email format', function() {
    const emailInput = document.getElementById('email');
    emailInput.value = 'invalid-email';
    expect(emailInput.checkValidity()).toBeFalse();
    
    emailInput.value = 'valid@example.com';
    expect(emailInput.checkValidity()).toBeTrue();
  });

  it('should require password field', function() {
    const passwordInput = document.getElementById('password');
    passwordInput.value = '';
    expect(passwordInput.checkValidity()).toBeFalse();
    
    passwordInput.value = 'password';
    expect(passwordInput.checkValidity()).toBeTrue();
  });
});

