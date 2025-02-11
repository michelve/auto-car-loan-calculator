$(document).ready(function () {
let chartInstance = null; // Store Chart instance to update without overlapping

const propertyTaxRates = {
    "Alabama": 0.36, "Alaska": 1.07, "Arizona": 0.45, "Arkansas": 0.53, "California": 0.68, "Colorado": 0.45,
    "Connecticut": 1.78, "Delaware": 0.48, "Florida": 0.71, "Georgia": 0.72, "Hawaii": 0.26, "Idaho": 0.47,
    "Illinois": 1.95, "Indiana": 0.71, "Iowa": 1.4, "Kansas": 1.26, "Kentucky": 0.74, "Louisiana": 0.51,
    "Maine": 0.96, "Maryland": 0.95, "Massachusetts": 1.04, "Michigan": 1.24, "Minnesota": 0.98, "Mississippi": 0.7,
    "Missouri": 0.82, "Montana": 0.69, "Nebraska": 1.44, "Nevada": 0.44, "New Hampshire": 1.61, "New Jersey": 2.08,
    "New Mexico": 0.67, "New York": 1.54, "North Carolina": 0.63, "North Dakota": 0.97, "Ohio": 1.3, "Oklahoma": 0.76,
    "Oregon": 0.77, "Pennsylvania": 1.26, "Rhode Island": 1.23, "South Carolina": 0.46, "South Dakota": 1.01,
    "Tennessee": 0.48, "Texas": 1.47, "Utah": 0.47, "Vermont": 1.56, "Virginia": 0.72, "Washington": 0.76,
    "West Virginia": 0.55, "Wisconsin": 1.38, "Wyoming": 0.55, "District of Columbia": 0.57
};

// Populate the state dropdown
const $stateDropdown = $('#state');
for (const [state, taxRate] of Object.entries(propertyTaxRates)) {
    $stateDropdown.append(`<option value="${taxRate}">${state}</option>`);
}

function updateLoanDefaults() {
    let loanType = $("input[name='loanType']:checked").val();
    if (loanType === 'fha') {
        $('#downPayment').val(3.5);
        $('#interestRate').val(3.5);
    }
    else if (loanType === 'conventional') {
        $('#downPayment').val(5);
        $('#interestRate').val(4.0);
    }
}

updateLoanDefaults();
$("input[name='loanType']").on('change', updateLoanDefaults);

$(document).ready(function () {
    let chartInstance = null; // Store Chart instance
    
    // Handle form submission
    $('#calculate').on('click', function () {
        let homePrice = parseFloat($('#homePrice').val()) || 0;
        let downPaymentPercent = parseFloat($('#downPayment').val()) || 0;
        let loanLength = parseInt($("input[name='loanLength']:checked").val()) || 30;
        let interestRate = parseFloat($('#interestRate').val()) || 0;
        let propertyTaxRate = parseFloat($('#state').val()) || 0;
        let homeInsuranceMonthly = parseFloat($('#homeInsurance').val()) || 0;
        let hoaFees = parseFloat($('#hoaFees').val()) || 0;
    
        if (homePrice <= 0) {
            alert("Please enter a valid home price.");
            return;
        }
    
        // Calculate values
        let totalDownPayment = homePrice * (downPaymentPercent / 100);
        let loanAmount = homePrice - totalDownPayment;
        let pmi = (loanAmount * 0.005) / 12;
        let propertyTax = homePrice * (propertyTaxRate / 100);
        let monthlyRate = interestRate / 100 / 12;
        let numPayments = loanLength * 12;
        let monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
        monthlyPayment += pmi + propertyTax / 12 + hoaFees + homeInsuranceMonthly;


    
        let recommendation = "";

        // Low Down Payment Warning
        if (downPaymentPercent < 5) {
          recommendation += `
            <div class="alert alert-warning d-flex align-items-start" role="alert">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              <div>
                <strong>Low Down Payment:</strong> A down payment below <strong>5%</strong> increases PMI and long-term interest costs. 
                Consider increasing your down payment to <strong>5% or more</strong> to reduce expenses over time.
              </div>
            </div>`;
        }
        
        // High PMI Warning
        if (pmi > 100) {
          recommendation += `
            <div class="alert alert-danger d-flex align-items-start" role="alert">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              <div>
                <strong>High PMI:</strong> Your Private Mortgage Insurance (PMI) cost is significant. 
                Consider saving for a <strong>20% down payment</strong> to eliminate PMI and reduce your monthly payment.
              </div>
            </div>`;
        }
        
        // High Interest Rate Alert
        if (interestRate > 5) {
          recommendation += `
            <div class="alert alert-info d-flex align-items-start" role="alert">
              <i class="bi bi-info-circle-fill me-2"></i>
              <div>
                <strong>High Interest Rate:</strong> Mortgage rates above <strong>5%</strong> can be costly. 
                If possible, <strong>lock in a fixed rate now</strong> or plan to <strong>refinance in the future</strong> when rates drop.
              </div>
            </div>`;
        }
        
        // Large Loan Advice
        if (loanAmount > 500000) {
          recommendation += `
            <div class="alert alert-warning d-flex align-items-start" role="alert">
              <i class="bi bi-exclamation-circle-fill me-2"></i>
              <div>
                <strong>Large Loan Consideration:</strong> Loans over <strong>$500,000</strong> require careful planning. 
                Ensure you have funds for <strong>closing costs, property taxes, and an emergency reserve</strong>. 
                Consider an <strong>adjustable-rate mortgage (ARM)</strong> if looking for lower initial payments.
              </div>
            </div>`;
        }
        
        // 30-Year Mortgage with 20% Down (Ideal Scenario)
        if (loanLength === 30 && downPaymentPercent >= 20) {
          recommendation += `
            <div class="alert alert-success d-flex align-items-start" role="alert">
              <i class="bi bi-check-circle-fill me-2"></i>
              <div>
                <strong>Great Financial Choice:</strong> A <strong>30-year mortgage with 20% down</strong> minimizes costs, 
                avoids PMI, and <strong>keeps more cash available for other investments</strong>.
              </div>
            </div>`;
        }
        
        // Expert Mortgage Tips (General Advice)
        recommendation += `
          <div class="alert alert-light border d-flex align-items-start" role="alert">
            <i class="bi bi-lightbulb-fill me-2 text-warning"></i>
            <div>
              <strong>Mortgage Tips:</strong>
              <ul class="mb-0">
                <li><strong>Extra Payments:</strong> Paying <strong>$100 extra per month</strong> can reduce total interest costs significantly.</li>
                <li><strong>Bi-Weekly Payments:</strong> Splitting payments into bi-weekly installments adds <strong>one extra payment per year</strong>, reducing your loan term.</li>
                <li><strong>Shop for Rates:</strong> Always <strong>compare at least 3 lenders</strong> to secure the best mortgage deal.</li>
                <li><strong>Credit Score Matters:</strong> A <strong>740+ score</strong> qualifies for the lowest rates. Work on improving credit to <strong>reduce borrowing costs</strong>.</li>
              </ul>
            </div>
          </div>`;
        
        // Credit Score & Loan Type Insights
        let creditScore = parseInt($('#creditScore').val()) || 0;
        let loanType = $("input[name='loanType']:checked").val();
        
        // FHA to Conventional Suggestion
        if (creditScore >= 700 && loanType === 'fha') {
          recommendation += `
            <div class="alert alert-info d-flex align-items-start" role="alert">
              <i class="bi bi-lightbulb-fill me-2 text-primary"></i>
              <div>
                <strong>Consider a Conventional Loan:</strong> With a credit score of <strong>${creditScore}</strong>, 
                you may qualify for a <strong>Conventional Loan</strong> instead of FHA.
                <ul class="mb-0">
                  <li><strong>No Permanent PMI:</strong> Unlike FHA, a <strong>Conventional Loan lets you remove PMI</strong> once you reach <strong>20% equity</strong>.</li>
                  <li><strong>Lower Costs:</strong> A Conventional loan saves <strong>thousands</strong> in PMI over time.</li>
                  <li><strong>Flexible Terms:</strong> Conventional loans offer <strong>15-year, 20-year, and 30-year options</strong> with customizable rates.</li>
                </ul>
              </div>
            </div>`;
        }
        
        // FHA Warning for High Credit Scores
        if (creditScore >= 740 && loanType === 'fha') {
          recommendation += `
            <div class="alert alert-warning d-flex align-items-start" role="alert">
              <i class="bi bi-exclamation-circle-fill me-2 text-warning"></i>
              <div>
                <strong>FHA May Not Be the Best Option:</strong> Your <strong>excellent credit score (${creditScore})</strong> qualifies you for 
                <strong>lower rates with a Conventional Loan</strong>.
                <ul class="mb-0">
                  <li>Lenders favor scores of <strong>740+</strong>, meaning you could get <strong>better terms</strong>.</li>
                  <li>Lower monthly payments by avoiding FHA's <strong>mandatory PMI</strong>.</li>
                </ul>
                Consider switching to Conventional financing to maximize savings.
              </div>
            </div>`;
        }
        
        // FHA Suggestion for Low Credit Score
        if (creditScore < 620 && loanType === 'conventional') {
          recommendation += `
            <div class="alert alert-danger d-flex align-items-start" role="alert">
              <i class="bi bi-x-circle-fill me-2 text-danger"></i>
              <div>
                <strong>Conventional Loan May Not Be Ideal:</strong> With a credit score of <strong>${creditScore}</strong>, 
                you may face <strong>higher interest rates or loan rejection</strong>.
                <ul class="mb-0">
                  <li><strong>FHA loans accept scores as low as 580</strong> and provide <strong>easier approval</strong>.</li>
                  <li><strong>Lower Down Payment:</strong> FHA requires <strong>only 3.5%</strong>, while Conventional may need <strong>5-10%</strong>.</li>
                </ul>
                FHA might be a better option to secure financing at a lower rate.
              </div>
            </div>`;
        }
    
        // Update UI
        $('#result-pmi').text(`$${pmi.toFixed(2)}`);
        $('#result-propertyTax').text(`$${propertyTax.toFixed(2)}`);
        $('#result-monthlyPayment').text(`$${monthlyPayment.toFixed(2)}`);
        $('#result-closingCost').text(`$${(loanAmount * 0.02).toFixed(2)}`);
        $('#result-homeInsurance').text(`$${(homeInsuranceMonthly * 12).toFixed(2)}`);
        $('#result-downPayment').text(`$${totalDownPayment.toFixed(2)}`);
        $('#result-totalCash').text(`$${(totalDownPayment + loanAmount * 0.02 + homeInsuranceMonthly * 12).toFixed(2)}`);
    
        $('#loan-recommendation').html(recommendation);
        $('#emptyStateSection').hide();
        $('#results').show();
        
    

    });
    });
    
});
