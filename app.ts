#! /usr/bin/env node 
import inquirer from "inquirer";
import chalk from "chalk";
import { faker, tr } from '@faker-js/faker';
class Customer{
    firstName:string;
    lastName:string;
    age:number;
    gender:string;
    MobileNo:number;
    AccountNo:number;
    constructor(fName:string,lName:string,age:number,gender:string,MobileNo:number,AccountNo:number){
     this.firstName = fName;
     this.lastName = lName;
     this.age = age;
     this.gender = gender;
     this.MobileNo = MobileNo;
     this.AccountNo = AccountNo;
    }
}
interface bankAccount{
    accountNo:number,
    balance:number
}
class Bank{
    customer:Customer[] = [];
    account:bankAccount[] = [];
    addCustomer(obj:Customer){
        this.customer.push(obj);
    }
    addAccount(obj:bankAccount){
        this.account.push(obj)
    }
    transition(accObj:bankAccount){
     let newAccount = this.account.filter((acc)=>acc.accountNo !==accObj.accountNo
    )
    this.account = [...newAccount,accObj]
    }
}
let myBank = new Bank();
for(let i:number = 1; i <= 3; i++){
let fName = faker.person.firstName("male");  
let lName = faker.person.lastName();
let age = parseInt(faker.string.numeric(2))
let pNum =parseInt(faker.string.numeric(10)
);
const customer = new Customer(fName,lName,age,"male",pNum,10000+i);
myBank.addCustomer(customer);
myBank.addAccount({accountNo:customer.AccountNo,balance:1000*i})
}


async function bankService(bank:Bank){
while(true){// Bank Functionality
 let service = await inquirer.prompt({
    name:"select",
    type:"list",
    message:"Select the Sevice",
    choices:["View Balance","withDraw","Cash Deposite","exit"]
 });
 switch(service.select){
     case "View Balance":
    let res = await inquirer.prompt({
        name:"accNum",
        type:"input",
        message:"Please Enter Your Account Number:"
    });
    let account = myBank.account.find((acc)=>acc.accountNo == res.accNum)
    if(!account){
        console.log(chalk.bold.italic.red("Invalid Account Number"));
    }else{
        let name = myBank.customer.find((item)=>item.AccountNo === account?.accountNo)
        console.log(`Dear ${chalk.bold.italic.green(name?.firstName ,name?.lastName)} Your Account Balance is ${chalk.bold.blueBright(`${account.balance}$`)}`);
    }    
    break;
    case "withDraw":
        let accNumInput = await inquirer.prompt({
            name:"accNum",
            type:"input",
            message:"Please Enter Your Account Number:"
        });
        let accountNum = myBank.account.find((acc)=>acc.accountNo == accNumInput.accNum)
        if(!accountNum){
            console.log(chalk.bold.italic.red("Invalid Account Number"))
        }
        if(accountNum){
            
            let ans = await inquirer.prompt({
                name:"amount",
                type:"number",
                message:"Enter Your Amount:"
            });
            let newBalance = accountNum.balance - ans.amount
            // transition method call 
            bank.transition({accountNo:accountNum.accountNo,balance:newBalance});
            if(accountNum.balance < ans.amount){
                console.log(chalk.bold.italic.red("Invalid Account Number"))
            }else{
                // console.log(`You Remaing Balance is ${chalk.bold.italic.blue(newBalance)}`);
                console.log(`${chalk.bold.italic.blue(`${ans.amount}$`)} ${chalk.bold.italic.green("is sucessfully withDraw from your account,Now your current balance is")} ${chalk.bold.italic.blue(`${newBalance}$`)}`);
            }
        }
        break;
        case "Cash Deposite":
            let accNumInput2 = await inquirer.prompt({
                name:"accNum",
                type:"input",
                message:"Please Enter Your Account Number:"
            });
            let accounT = myBank.account.find((acc)=>acc.accountNo == accNumInput2.accNum)
            if(!accounT){
                console.log(chalk.bold.italic.red("Invalid Account Number"))
            }
            if(accounT){
                
                let ans = await inquirer.prompt({
                    name:"amount",
                    type:"number",
                    message:"Enter Your Amount:"
                });
                let newBalance = accounT.balance + ans.amount
                // transition method call 
                bank.transition({accountNo:accounT.accountNo,balance:newBalance});
                console.log(`${chalk.bold.italic.blue(`${ans.amount}$`)} ${chalk.bold.italic.green("is sucessfully deposited in your account,Now your current balance is")} ${chalk.bold.italic.blue(`${newBalance}$`)}`);
                
            }
            break;
            case "exit":
                console.log(chalk.bold.italic.red("Exiting..."));
                process.exit();
                
            }   
        }
    }
    bankService(myBank);
        