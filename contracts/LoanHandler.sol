// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LoanHandler {
    struct Loan {
        address borrower;
        uint256 collateralValue;
        uint256 interestRate;
        uint256 loanAmount;
        uint256 time;
        uint256 totalPayment;
        bool isActive;
    }

    mapping(uint256 => Loan) public loans;
    mapping(address => uint256[]) public borrowerLoans;
    uint256 public loanCounter;

    event LoanRequested(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 collateralValue,
        uint256 loanAmount,
        uint256 interestRate,
        uint256 time,
        uint256 totalPayment
    );

    event LoanPaid(uint256 indexed loanId, address indexed borrower);

    function requestLoan(
        uint256 collateralValue,
        uint256 interestRate,
        uint256 loanAmount,
        uint256 time,
        uint256 totalPayment
    ) external returns (uint256) {
        require(collateralValue > 0, "Collateral value must be greater than 0");
        require(interestRate > 0, "Interest rate must be greater than 0");
        require(loanAmount > 0, "Loan amount must be greater than 0");
        require(time > 0, "Time must be greater than 0");
        require(totalPayment > 0, "Total payment must be greater than 0");

        uint256 loanId = loanCounter++;
        loans[loanId] = Loan({
            borrower: msg.sender,
            collateralValue: collateralValue,
            interestRate: interestRate,
            loanAmount: loanAmount,
            time: time,
            totalPayment: totalPayment,
            isActive: true
        });

        // Add loan ID to borrower's list
        borrowerLoans[msg.sender].push(loanId);

        emit LoanRequested(
            loanId,
            msg.sender,
            collateralValue,
            loanAmount,
            interestRate,
            time,
            totalPayment
        );

        return loanId;
    }

    function getLoan(
        uint256 loanId
    )
        external
        view
        returns (
            address borrower,
            uint256 collateralValue,
            uint256 interestRate,
            uint256 loanAmount,
            uint256 time,
            uint256 totalPayment,
            bool isActive
        )
    {
        Loan memory loan = loans[loanId];
        return (
            loan.borrower,
            loan.collateralValue,
            loan.interestRate,
            loan.loanAmount,
            loan.time,
            loan.totalPayment,
            loan.isActive
        );
    }

    /**
     * @dev Get the number of loans for a specific borrower
     * @param borrower The address of the borrower
     * @return The number of loans
     */
    function getBorrowerLoanCount(
        address borrower
    ) external view returns (uint256) {
        return borrowerLoans[borrower].length;
    }

    /**
     * @dev Get a specific loan ID for a borrower by index
     * @param borrower The address of the borrower
     * @param index The index of the loan in the borrower's list
     * @return The loan ID
     */
    function getBorrowerLoanId(
        address borrower,
        uint256 index
    ) external view returns (uint256) {
        require(index < borrowerLoans[borrower].length, "Index out of bounds");
        return borrowerLoans[borrower][index];
    }

    /**
     * @dev Pay off a loan
     * @param loanId The ID of the loan to pay
     */
    function payLoan(uint256 loanId) external payable {
        Loan storage loan = loans[loanId];
        require(loan.isActive, "Loan is not active");
        require(msg.sender == loan.borrower, "Only borrower can pay the loan");
        require(
            msg.value == loan.totalPayment,
            "Payment amount must match total payment"
        );

        // Deactivate the loan
        loan.isActive = false;

        // Remove loan from borrower's list
        uint256[] storage borrowerLoanList = borrowerLoans[msg.sender];
        for (uint256 i = 0; i < borrowerLoanList.length; i++) {
            if (borrowerLoanList[i] == loanId) {
                // Swap with last element and pop
                borrowerLoanList[i] = borrowerLoanList[
                    borrowerLoanList.length - 1
                ];
                borrowerLoanList.pop();
                break;
            }
        }

        emit LoanPaid(loanId, msg.sender);
    }
}
