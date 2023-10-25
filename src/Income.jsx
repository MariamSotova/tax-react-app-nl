import React, { useCallback, useState } from "react";

export const Income = () => {
  const [salary, changeSalary] = useState(0);
  const [tax, changeTax] = useState(0);

  const onSalaryChange = useCallback((e) => {
    changeSalary(e.target.value);
  }, []);

  const onSubmit = useCallback(() => {
    const newTax = calculateNetMonthIncome(salary);

    changeTax(newTax);
  }, [salary]);

  return (
    <div className="income">
      <div className="wrapper-tax">
        <div className="tax-wrp">
          <h1>Dutch Income Tax Calculator</h1>
          <p>
            If your annual salary is less than/or equal to 35129 € - 9.45 % per
            year, <br />
            less than/equal to 68507 € - 37.1 %, <br />
            wages above 68507 € are taxed at 49.5 % per year.
          </p>
          <p className="text">Write down your salary for the year in €</p>

          <input
            onChange={onSalaryChange}
            value={salary}
            type="number"
            min="0"
            autoFocus
            required
            id="input-salary"
          />
        </div>
        <div className="tax-wrp">
          <p className="text">This is the amount you pay per year.</p>
          <div id="income-tax">{tax === 0 ? null : tax}</div>
        </div>
        <button onClick={onSubmit} className="count" id="count">
          count €
        </button>
      </div>
    </div>
  );
};

// логика расчета ниже
const taxIntervals = [
  { maxValue: 35129, rate: 9.45 },
  { maxValue: 68507, rate: 37.1 },
  { maxValue: Number.MAX_SAFE_INTEGER, rate: 49.5 },
];
export function calculateNetMonthIncome(yearIncome) {
  let tax = 0;
  let taxableIncome = 0;
  for (let i = 0; i < taxIntervals.length; i++) {
    const { maxValue, rate } = taxIntervals[i];
    const isFinalInterval = maxValue >= yearIncome;
    const currentTaxableIncome = isFinalInterval ? yearIncome : maxValue;
    tax += ((currentTaxableIncome - taxableIncome) * rate) / 100;
    taxableIncome = currentTaxableIncome; // сохр с кажд циклом число
    if (isFinalInterval) {
      break;
    }
  }
  const netMonthIncome = (yearIncome - tax) / 12;
  return Number.parseFloat(netMonthIncome.toFixed(2));
}
// 90000 = 35129 (9.45%) + 33378 (37.10%) + 21493 (49.50%)
// 68600 = 35129 (9.45%) + 33378 (37.10%) + 93 (49.50%)
// 20000
// 1 isFinalInterval = true -> currentTaxableIncome = 20000 -> (20000 - 0) * 9.45 -> +tax
// end
// 40000
// 1 isFinalInterval = false -> currentTaxableIncome = 35129 -> (35129 - 0) * 9.45 -> +tax
// 2 isFinalInterval = true -> currentTaxableIncome = 40000 -> (40000 - 35129) * 37.1 -> +tax
// end
// 80000
// 1 isFinalInterval = false -> currentTaxableIncome = 35129 -> (35129 - 0) * 9.45 -> +tax
// 2 isFinalInterval = false -> currentTaxableIncome = 68507 -> (68507 - 35129) * 37.1 -> +tax
// 3 isFinalInterval = true -> currentTaxableIncome = 80000 -> (80000 - 68507) * 49.5 -> +tax
