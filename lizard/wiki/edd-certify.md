# EDD Certify Workflow

**URL:** Navigate to `uio.edd.ca.gov` → click **Certify** in nav (never direct URL — EDD blocks direct navigation).

## Standard answers (Handshake AI income)
- Q1 sick/injured: **No**
- Q2 reason couldn't accept full-time: **No**
- Q3 looked for work: **Yes**
- Q4 refused work: **No**
- Q5 began school/training: **No**
- Q6 did you work: **Yes**
- Other income than wages: **No**
- Stipend clarification Q1: **Yes** (received stipend)
- Stipend clarification Q2: **No**

## Work Search Record
Next through (no entries needed if already logged elsewhere).

## Enter Wages (per week)
- Employer: **Handshake AI Solutions, LLC**
- Address: 225 Bush St, San Francisco, CA 94104-4215
- Hours method: **Total for the week**
- Wage Type: **Stipend**
- Enter hours + total wages → **Add Wage**
- Address verification modal → "Use standardized address" pre-selected → **Submit**
- Click **All Wages Entered**

## Employment Information (per week)
- Last Day of Work: actual last day that week
- Employer type: **Self Employment**
- Still working: **No**
- Employment Status: **Laid Off due to Lack of Work**
- Additional details: **paid as you go**
- Self-employment willingness: **Yes**
- Click **Update** → Next

## Review and Submit
- Check **Acknowledgement** checkbox
- Enter mailing address ZIP Code
- Click **Submit**

## JS patterns for stubborn fields
```javascript
// Radio
const ns = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'checked').set;
ns.call(radio, true);
radio.dispatchEvent(new Event('change', { bubbles: true }));
radio.click();

// Select
const ns = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set;
ns.call(sel, value);
sel.dispatchEvent(new Event('change', { bubbles: true }));

// Text / textarea
const ns = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
ns.call(input, value);
input.dispatchEvent(new Event('input', { bubbles: true }));
input.dispatchEvent(new Event('change', { bubbles: true }));
```

## Gotchas
- Page UIDs reset after every ASP.NET postback — fresh snapshot before each click
- Address verification modal fires after every "Add Wage"
- "Still working" and "self-employment willingness" are both Yes/No radio pairs — JS label matching picks wrong one; use direct uid clicks
- Never navigate away mid-form (EDD disables Back/Refresh)
