$(document).ready(function () {
    $('#loanSummarySection').hide(); // Initially hide Loan Summary

    function calculateGapRecommendation(netTradeInValue, debtToIncomeRatio) {
        let recommendation = 'Not Needed';
        let reason = 'Your loan amount and financial situation do not indicate a need for GAP Insurance.';
    
        if (netTradeInValue < 0) {
            recommendation = 'Highly Recommended';
            reason = 'Your trade-in value is less than the amount owed, which puts you at risk of being upside-down on the loan. GAP Insurance can protect you from this risk.';
        } else if (debtToIncomeRatio > 36) {
            recommendation = 'Recommended';
            reason = 'Your debt-to-income ratio exceeds 36%, indicating potential financial strain. GAP Insurance can provide an extra layer of security.';
        }
    
        // Populate GAP Insurance Section
        $('#gapRecommendation').text(recommendation);
        $('#gapReason').text(reason);
    }

    
    // Risk Analysis Function
    function calculateRiskAnalysis(loanAmount, carPrice, apr, monthlyPayment, monthlyIncome) {
        // Loan-to-Value Ratio
        const loanToValueRatio = (loanAmount / carPrice) * 100; // Loan amount as a percentage of car price

        // Debt-to-Income Ratio
        const debtToIncomeRatio = (monthlyPayment / monthlyIncome) * 100;

        // Default Risk Probability
        let defaultRisk = 0;
        if (loanToValueRatio > 90) defaultRisk += 20; // High risk for LTV > 90%
        if (debtToIncomeRatio > 36) defaultRisk += 25; // High risk for DTI > 36%
        if (apr > 10) defaultRisk += 15; // High risk for APR > 10%
        if (loanAmount > 50000) defaultRisk += 10; // Higher risk for large loans

        // Adjust Risk for Positive Factors
        if (downPayment / carPrice > 0.2) defaultRisk -= 10; // Lower risk if down payment > 20%
        defaultRisk = Math.min(Math.max(defaultRisk, 0), 100); // Cap risk between 0% and 100%

        // Populate Risk Analysis Section
        $('#defaultRisk').text(`${defaultRisk.toFixed(1)}%`);
        $('#debtIncomeRatio').text(`${debtToIncomeRatio.toFixed(1)}%`);

        // Determine recommendation or warning message and badge class
        let badgeClass = '';
        let badgeText = '';
        let message = '';

        if (defaultRisk > 65) {
            badgeClass = 'bg-danger'; // Red for high risk
            badgeText = 'High Risk of Default';
            message = 'Consider reducing loan amount or increasing down payment.';
        } else if (defaultRisk > 40) {
            badgeClass = 'bg-warning text-dark'; // Yellow for moderate risk
            badgeText = 'Moderate Risk';
            message = 'Ensure your financial situation can support this loan.';
        } else {
            badgeClass = 'bg-success'; // Green for low risk
            badgeText = 'Low Risk';
            message = 'This appears to be a good deal.';
        }

        // Replace the existing message or add a new one
        $('#riskAnalysisSection .card-body .msg-container').remove(); // Remove any existing message container
        $('#riskAnalysisSection .card-body').append(`
            <div class="msg-container text-center mt-3">
                <span class="badge ${badgeClass} p-2 fs-6">${badgeText}</span>
                <p class="mt-2 text-muted small">${message}</p>
            </div>
        `);
    }

    // Function to auto-detect user's state
    function detectState() {
        $.getJSON('https://ipapi.co/json/', function (data) {
            const userState = data.region; // Extract user's state name (e.g., "Florida")
            const stateOptions = $('#stateTax option');

            // Find and select the corresponding state in the dropdown
            stateOptions.each(function () {
                if ($(this).text().includes(userState)) {
                    $(this).prop('selected', true);
                    $('#stateTax').trigger('change'); // Trigger change event to update calculations
                    return false; // Break the loop once the state is found
                }
            });
        }).fail(function () {
            console.error('Failed to fetch geolocation data.');
        });
    }

    // Function to load APR options dynamically from inline data
    function loadAprOptions() {
        const aprData = [
            { label: "Excellent Credit (750+)", rate: 3.99 },
            { label: "Very Good Credit (720-749)", rate: 4.49 },
            { label: "Good Credit (700-719)", rate: 5.49 },
            { label: "Above Average Credit (680-699)", rate: 6.49 },
            { label: "Average Credit (660-679)", rate: 7.49 },
            { label: "Fair Credit (640-659)", rate: 8.99 },
            { label: "Below Average Credit (620-639)", rate: 10.49 },
            { label: "Poor Credit (600-619)", rate: 12.99 },
            { label: "Very Poor Credit (Below 600)", rate: 15.99 },
            { label: "Custom Rate (User-Entered)", rate: null }
        ];

        const aprDropdown = $('#aprDropdown');
        aprData.forEach((item) => {
            aprDropdown.append(`<option value="${item.rate || 'custom'}">${item.label}${item.rate ? ` - ${item.rate}%` : ''}</option>`);
        });
    }

    // Function to load Registration Fees dynamically from inline data
    function loadRegistrationFees() {
        const registrationData = [
            { state: "Alabama", fee: 23 },
            { state: "Alaska", fee: 100 },
            { state: "Arizona", fee: 32 },
            { state: "Arkansas", fee: 30 },
            { state: "California", fee: 175 },
            { state: "Colorado", fee: 50 },
            { state: "Connecticut", fee: 80 },
            { state: "Delaware", fee: 40 },
            { state: "Florida", fee: 225 },
            { state: "Georgia", fee: 20 },
            { state: "Hawaii", fee: 12 },
            { state: "Idaho", fee: 69 },
            { state: "Illinois", fee: 151 },
            { state: "Indiana", fee: 36.35 },
            { state: "Iowa", fee: 60 },
            { state: "Kansas", fee: 52.25 },
            { state: "Kentucky", fee: 21 },
            { state: "Louisiana", fee: 82 },
            { state: "Maine", fee: 35 },
            { state: "Maryland", fee: 187 },
            { state: "Massachusetts", fee: 60 },
            { state: "Michigan", fee: 120 },
            { state: "Minnesota", fee: 70 },
            { state: "Mississippi", fee: 14 },
            { state: "Missouri", fee: 51.25 },
            { state: "Montana", fee: 217 },
            { state: "Nebraska", fee: 15 },
            { state: "Nevada", fee: 33 },
            { state: "New Hampshire", fee: 31.2 },
            { state: "New Jersey", fee: 84 },
            { state: "New Mexico", fee: 62 },
            { state: "New York", fee: 140 },
            { state: "North Carolina", fee: 36 },
            { state: "North Dakota", fee: 274 },
            { state: "Ohio", fee: 31 },
            { state: "Oklahoma", fee: 96 },
            { state: "Oregon", fee: 312 },
            { state: "Pennsylvania", fee: 38 },
            { state: "Rhode Island", fee: 30 },
            { state: "South Carolina", fee: 40 },
            { state: "South Dakota", fee: 144 },
            { state: "Tennessee", fee: 26.5 },
            { state: "Texas", fee: 50.75 },
            { state: "Utah", fee: 44 },
            { state: "Vermont", fee: 132 },
            { state: "Virginia", fee: 40 },
            { state: "Washington", fee: 45 },
            { state: "West Virginia", fee: 51 },
            { state: "Wisconsin", fee: 85 },
            { state: "Wyoming", fee: 35 }
        ];

        const registrationDropdown = $('#registrationDropdown');
        registrationData.forEach((item) => {
            registrationDropdown.append(`<option value="${item.fee}">${item.state} - $${item.fee}</option>`);
        });
    }

    // Call detectState, loadAprOptions, and loadRegistrationFees functions when the page loads
    detectState();
    loadAprOptions();
    loadRegistrationFees();

    // Dark mode toggle
    $('#darkModeToggle').click(function () {
        $('body').toggleClass('bg-dark text-white');
        $('.card, select, input, .btn').toggleClass('bg-secondary text-white border-light');
    });

    // Tooltip activation
    $('[data-bs-toggle="tooltip"]').tooltip();


    function validateInputs() {
        const form = document.getElementById('loanForm');
    
        if (!form.checkValidity()) {
            // Highlight invalid fields
            form.classList.add('was-validated');
    
            // Show toasts for specific errors
            const carPrice = parseFloat($('#carPrice').val()) || 0;
            const apr = parseFloat($('#aprDropdown').val()) || 0;
    
            if (carPrice <= 0) {
                const carPriceToast = document.getElementById('carPriceToast');
                const toast = new bootstrap.Toast(carPriceToast);
                toast.show();
            }
    
            if (apr <= 0 || apr > 100) {
                const aprToast = document.getElementById('aprToast');
                const toast = new bootstrap.Toast(aprToast);
                toast.show();
            }
    
            return false; // Prevent form submission
        }
    
        form.classList.remove('was-validated');
        return true; // Valid inputs
    }
    

    // Update Vehicle Tax calculation
    function updateVehicleTax() {
        const carPrice = parseFloat($('#carPrice').val()) || 0;
        const taxRate = parseFloat($('#stateTax').val()) / 100 || 0;
        const vehicleTax = carPrice * taxRate;
        $('#vehicleTax').val(vehicleTax.toFixed(2));
        return vehicleTax;
    }

    // Update Trade-In Tax Savings
    function updateTradeTaxSavings() {
        const tradeIn = parseFloat($('#tradeIn').val()) || 0;
        const taxRate = parseFloat($('#stateTax').val()) / 100 || 0;
        const tradeTaxSavings = tradeIn * taxRate;
        $('#tradeTaxSavings').val(tradeTaxSavings.toFixed(2));
        return tradeTaxSavings;
    }

    // Calculate Monthly Payment (Reusable Function)
    function calculateMonthlyPayment(loanAmount, apr, term) {
        const monthlyRate = apr / 12; // Monthly interest rate
        return loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
    }

    // Generate Amortization Schedule
    function generateAmortizationSchedule(loanAmount, apr, loanTerm) {
        const monthlyRate = apr / 12;
        const monthlyPayment = calculateMonthlyPayment(loanAmount, apr, loanTerm);

        let schedule = [];
        let balance = loanAmount;
        for (let i = 1; i <= loanTerm; i++) {
            const interestPayment = balance * monthlyRate;
            const principalPayment = monthlyPayment - interestPayment;
            balance -= principalPayment;

            schedule.push({
                month: i,
                principal: principalPayment.toFixed(2),
                interest: interestPayment.toFixed(2),
                balance: balance.toFixed(2)
            });
        }
        return schedule;
    }

    // Event Listeners
    $('#stateTax, #carPrice').on('input', updateVehicleTax);
    $('#tradeIn').on('input', updateTradeTaxSavings);
    $('#toggleTradeIn').change(() => $('#tradeInSection').toggle());

    // Print Page
    $('#printPage').click(function () {
        const summaryHtml = $('#loanSummarySection').html();
        const newWindow = window.open('', '_blank');
        newWindow.document.write(`
            <html>
            <head><title>Loan Summary</title></head>
            <body>${summaryHtml}</body>
            </html>
        `);
        newWindow.print();
        newWindow.close();
    });

    // Calculate Button Click Event
    $('#calculateBtn').click(function () {
        if (!validateInputs()) return; // Validate user inputs

        const button = $(this);
        $('#emptyStateSection').hide();


        // Check if the form is valid
        if ($('#loanForm')[0].checkValidity()) {
            // Change button label and disable it
            button.text('Please wait...');
            button.prop('disabled', true);
    
            // Simulate a delay (2 seconds) to restore the button
            setTimeout(function () {
                button.text('Calculate Payment'); // Restore original label
                button.prop('disabled', false); // Enable the button
            }, 2000);
        } else {
            // Trigger Bootstrap validation
            $('#loanForm')[0].reportValidity();
        }

        // User inputs
        const carPrice = parseFloat($('#carPrice').val()) || 0;
        const dealerFees = parseFloat($('#dealerFees').val()) || 0;
        const tradeInValue = parseFloat($('#tradeIn').val()) || 0;
        const downPayment = parseFloat($('#downPayment').val()) || 0;
        const loanTerm = parseInt($('input[name="loanTerm"]:checked').val()) || 72;
        const apr = parseFloat($('#aprDropdown').val()) / 100 || 0;
        const registrationFee = parseFloat($('#registrationDropdown').val()) || 0;
        const amountOwed = parseFloat($('#amountOwed').val()) || 0; // Amount owed on trade-in
        const monthlyIncome = parseFloat($('#monthlyIncome').val()) || 0; // Capture monthly income


        const vehicleTax = updateVehicleTax();
        const tradeTaxSavings = updateTradeTaxSavings();

        // Calculate net trade-in equity
        const netTradeInValue = tradeInValue - amountOwed; // Can be negative if amount owed > trade-in value


        // Additional costs based on checkboxes
        const warrantyCost = $('#addWarranty').is(':checked') ? 1500 : 0; // Warranty cost
        const gapInsuranceCost = $('#addGapInsurance').is(':checked') ? 1000 : 0; // GAP insurance cost
        const servicePackageCost = $('#addServicePackage').is(':checked') ? 2000 : 0; // Service package cost
        


        // Calculate adjusted loan amount
        const loanAmount = Math.max(
            carPrice + dealerFees + vehicleTax + registrationFee + warrantyCost + gapInsuranceCost + servicePackageCost - tradeTaxSavings + Math.abs(Math.min(netTradeInValue, 0)) - Math.max(netTradeInValue, 0) - downPayment,
            0
        );

        if (loanAmount <= 0) {
            const toastElement = document.getElementById('loanToast');
            const toast = new bootstrap.Toast(toastElement);
            toast.show(); // Show the toast notification
            return;
        }
        
        // Calculate monthly payment
        const monthlyPayment = calculateMonthlyPayment(loanAmount, apr, loanTerm);

        // Calculate total interest paid
        const totalInterest = (monthlyPayment * loanTerm) - loanAmount;

        // Populate Risk Analysis Section
        calculateRiskAnalysis(loanAmount, carPrice, apr, monthlyPayment, monthlyIncome);
        
        const debtToIncomeRatio = calculateRiskAnalysis(loanAmount, carPrice, apr, monthlyPayment, monthlyIncome);
        calculateGapRecommendation(netTradeInValue, debtToIncomeRatio);
        


        // Update user selection results
        $('#loanAmount').text(`$${loanAmount.toFixed(2)}`);
        $('#monthlyPayment').text(`$${monthlyPayment.toFixed(2)}`);
        $('#taxSavings').text(`$${tradeTaxSavings.toFixed(2)}`);
        $('#totalInterest').text(`$${totalInterest.toFixed(2)}`);

        // Alternative financing options
        const alternatives = [
            { down: 0, term: 84, id: '#altOption1' },
            { down: 3000, term: 72, id: '#altOption2' },
            { down: 5000, term: 72, id: '#altOption3' },
            { down: 7000, term: 84, id: '#altOption4' }
        ];

        alternatives.forEach(option => {
            const altLoanAmount = Math.max(
                carPrice + dealerFees + vehicleTax + registrationFee + warrantyCost + gapInsuranceCost + servicePackageCost - tradeTaxSavings + Math.abs(Math.min(netTradeInValue, 0)) - Math.max(netTradeInValue, 0) - option.down,
                0
            );
            const altMonthlyPayment = calculateMonthlyPayment(altLoanAmount, apr, option.term);
    
            // Update alternative payment results
            $(option.id).text(`$${altMonthlyPayment.toFixed(2)}`);
        });

        // Generate and display Amortization Schedule
        const schedule = generateAmortizationSchedule(loanAmount, apr, loanTerm);
        let tableHtml = '<table class="table table-striped table-sm"><thead><tr><th>Month</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead><tbody>';
        schedule.forEach(row => {
            tableHtml += `<tr><td>${row.month}</td><td>$${row.principal}</td><td>$${row.interest}</td><td>$${row.balance}</td></tr>`;
        });

        tableHtml += '</tbody></table>';
        $('#amortizationSchedule').html(tableHtml);

        // After calculations, make the results visible
        $('#calculationResults').fadeIn('slow'); // Smoothly reveal the results section

        // Show the Loan Summary section
        $('#loanSummarySection').fadeIn('slow');
        $('#gapRecommendationSection').fadeIn('slow');

        $('html, body').animate({
            scrollTop: $('.sumamry-wrapper').offset().top
        }, 1000); // Adjust 1000 for animation duration in milliseconds


    });
});


$(document).ready(function () {
    const scrollToTopBtn = $('#scrollToTopBtn');

    // Show/Hide button based on scroll position
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 200) {
            scrollToTopBtn.fadeIn();
        } else {
            scrollToTopBtn.fadeOut();
        }
    });

});
