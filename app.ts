#! /usr/bin/env node 
import figlet from 'figlet';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { faker } from '@faker-js/faker';

class Customer {
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    MobileNo: number;
    AccountNo: number;
    constructor(fName: string, lName: string, age: number, gender: string, MobileNo: number, AccountNo: number) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.MobileNo = MobileNo;
        this.AccountNo = AccountNo;
    }
}

interface BankAccount {
    accountNo: number;
    balance: number;
}

class Bank {
    customer: Customer[] = [];
    account: BankAccount[] = [];
    addCustomer(obj: Customer) {
        this.customer.push(obj);
    }
    addAccount(obj: BankAccount) {
        this.account.push(obj);
    }
    transition(accObj: BankAccount) {
        let newAccount = this.account.filter((acc) => acc.accountNo !== accObj.accountNo);
        this.account = [...newAccount, accObj];
    }
}

let myBank = new Bank();
for (let i: number = 1; i <= 10; i++) {
    let fName = faker.person.firstName('male');
    let lName = faker.person.lastName();
    let age = parseInt(faker.string.numeric(2));
    let pNum = parseInt(faker.string.numeric(10));
    const customer = new Customer(fName, lName, age, 'male', pNum, 10000 + i);
    myBank.addCustomer(customer);
    myBank.addAccount({ accountNo: customer.AccountNo, balance: 1000 * i });
}

const displayBanner = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        figlet('My Bank', (err, data) => {
            if (err) {
                console.log('Oops, something went wrong...');
                console.dir(err);
                reject(err);
            } else {
                console.log(chalk.green(data));
                resolve();
            }
        });
    });
};

const bankService = async (bank: Bank) => {
    console.log(`${'-'.repeat(50)}\n${chalk.blue.bold.italic("OOPS MY BANK ACCOUNT")}\n${chalk.bold.italic.yellow('Available Account Numbers# (10001-10010)')}\n${'-'.repeat(50)}`);

    while (true) {
        let service = await inquirer.prompt({
            name: 'select',
            type: 'list',
            message: 'Select the Service',
            choices: ['View Balance', 'Withdraw', 'Cash Deposit', 'Exit'],
        });

        switch (service.select) {
            case 'View Balance':
                let res = await inquirer.prompt({
                    name: 'accNum',
                    type: 'input',
                    message: 'Please Enter Your Account Number:',
                });
                let account = myBank.account.find((acc) => acc.accountNo == res.accNum);
                if (!account) {
                    console.log(chalk.bold.italic.red('Invalid Account Number'));
                } else {
                    let name = myBank.customer.find((item) => item.AccountNo === account?.accountNo);
                    console.log(
                        `Dear ${chalk.bold.italic.green(name?.firstName, name?.lastName)} Your Account Balance is ${chalk.bold.blueBright(`${account.balance}$`)}`
                    );
                }
                break;

            case 'Withdraw':
                let accNumInput = await inquirer.prompt({
                    name: 'accNum',
                    type: 'input',
                    message: 'Please Enter Your Account Number:',
                });
                let accountNum = myBank.account.find((acc) => acc.accountNo == accNumInput.accNum);
                if (!accountNum) {
                    console.log(chalk.bold.italic.red('Invalid Account Number'));
                }
                if (accountNum) {
                    let ans = await inquirer.prompt({
                        name: 'amount',
                        type: 'number',
                        message: 'Enter Your Amount:',
                    });
                    let newBalance = accountNum.balance - ans.amount;
                    bank.transition({ accountNo: accountNum.accountNo, balance: newBalance });
                    if (accountNum.balance < ans.amount) {
                        console.log(chalk.bold.italic.red('Insufficient Balance'));
                    } else {
                        console.log(
                            `${chalk.bold.italic.blue(`${ans.amount}$`)} ${chalk.bold.italic.green(
                                'is successfully withdrawn from your account. Now your current balance is'
                            )} ${chalk.bold.italic.blue(`${newBalance}$`)}`
                        );
                    }
                }
                break;

            case 'Cash Deposit':
                let accNumInput2 = await inquirer.prompt({
                    name: 'accNum',
                    type: 'input',
                    message: 'Please Enter Your Account Number:',
                });
                let accounT = myBank.account.find((acc) => acc.accountNo == accNumInput2.accNum);
                if (!accounT) {
                    console.log(chalk.bold.italic.red('Invalid Account Number'));
                }
                if (accounT) {
                    let ans = await inquirer.prompt({
                        name: 'amount',
                        type: 'number',
                        message: 'Enter Your Amount:',
                    });
                    let newBalance = accounT.balance + ans.amount;
                    bank.transition({ accountNo: accounT.accountNo, balance: newBalance });
                    console.log(
                        `${chalk.bold.italic.blue(`${ans.amount}$`)} ${chalk.bold.italic.green(
                            'is successfully deposited in your account. Now your current balance is'
                        )} ${chalk.bold.italic.blue(`${newBalance}$`)}`
                    );
                }
                break;

            case 'Exit':
                console.log(chalk.bold.italic.red('Exiting...'));
                process.exit();
        }
    }
};

const startApp = async () => {
    await displayBanner();
    await bankService(myBank);
};

startApp();
