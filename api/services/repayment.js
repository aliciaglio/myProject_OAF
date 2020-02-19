var express = require('express');
//This class include all the logic for update Summaries

let id;

class RepaymentService{
    //constructor of class
    constructor(dataInput,summaries){
        this.dataInput=dataInput;
        this.summaries=summaries;
    }

    getUploads(){
        return this.dataInput;
    }

    getSummaries(){
        return this.summaries;
    }

    //Logic Repayment Logic
    updateSummaries(){
        id =1;
        let summariesList = this.summaries;
        let outputData = this.dataInput.map((input) => {
            // check that the updateRepayment has correct data
            if(!this.validInput(input)){
                console.log(`The input has a mistake`); //send json.input
                return undefined;
            }
            const {CustomerID, SeasonID, Date, Amount} = input;
            //Case Override
            if (!!SeasonID){
                const summaryToUpdate = summariesList.find(function(sum){
                    if(sum.CustomerID == CustomerID && sum.SeasonID == SeasonID){
                        return sum;
                    }
                });
                id++;
            //update a line in the output    
                return {
                    RepaymentID: id-1,
                    CustomerID: CustomerID,
                    SeasonID: SeasonID,
                    Date: Date,
                    Amount: (+Amount),
                    ParentID: null
                };
            }

           // take all summaries with debts for the specific customer, where seasonID is not defined
            const listSummaries = summariesList.filter(function(item){
                if(item.CustomerID == CustomerID && item.Credit!=item.TotalRepaid)
                return item.CustomerID == CustomerID;
            });
            //order to get first the oldest season
            listSummaries.sort((a, b) => (a.SeasonID > b.SeasonID) ? 1 : -1);

            //Execute cascade logic
            let outCascade = this.cascade(listSummaries, CustomerID, Amount, Date);
            let spreadOut = [...outCascade];
            return spreadOut;

        

            
        });
        return outputData;

    }

    cascade(listSummary,customerID, amount, date, parentID=null){
        id++;
        let idParent = parentID;
        let outCascade=[];
        let lastDebt = listSummary[0];
        let netAmount=0;
        let restAmount=0;
        let toPay = lastDebt.Credit - lastDebt.TotalRepaid;
        if (amount > toPay){
            netAmount = amount - toPay;
            restAmount = amount - netAmount;
        }
        else{
            netAmount = amount;
        }
        outCascade.push({
            RepaymentID: id-1,
            CustomerID: customerID,
            SeasonID: lastDebt.SeasonID,
            Date: date,
            Amount: +amount,
            ParentID: parentID});
        //check if this customer has more seasons with debts, if he/she has just one, just this one will be updated
        let nextDebts = listSummary.filter((item)=>{
            return item.SeasonID != lastDebt.SeasonID; 
        });
        //If he/she has more season and rest credict, create additional repayment records
        if(restAmount > 0 && !!nextDebts){    //separate nextDebts?
            if(!idParent) {idParent = id-1;}
            id++;
            //negative record is created
            outCascade.push({
                RepaymentID: id-1,
                CustomerID: customerID,
                SeasonID: lastDebt.SeasonID,
                Date: date,
                Amount: -restAmount,
                ParentID: idParent});

       // to create the child positive records, recall cascade function
        outCascade=outCascade.concat(this.cascade(nextDebts, customerID, restAmount, date, idParent));
        }
    return outCascade;
    }

    //Function to validate input
    validInput(params){
        let bool = true;
        const keys = Object.keys(params);

        keys.forEach((key) =>{
            if(!params[key] && key!="SeasonID"){
                console.log(`The param=${key} is null or undefined`);
                bool = false;
            }
            if(key == "CustomerID" || key == "SeasonID" || key == "Amount"){
                if(Number.isNaN(params[key])){
                    console.log(`The ${key} is Not a Number`);
                    bool = false;
                } else if(params[key] < 0){
                    console.log(`The ${key} cannot be Negative`);
                    bool = false;
                }
            }else if( key == "Date"){
                if(!this.isValidDate(params[key])){
                    console.log(`The ${key} is not Date format or a valid Date`);
                    bool = false;
                }

            }else{
                console.log(`The keyName=${key} is not correct`);
                bool = false;
            }
            
        });
        return bool;
    }

    //Function to Validate format of Date
    isValidDate(dateString){
    // First check for the pattern
    if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
        return false;

    // Parse the date parts to integers
    var parts = dateString.split("/");
    var day = parseInt(parts[1], 10);
    var month = parseInt(parts[0], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if(year < 1000 || year > 3000 || month == 0 || month > 12)
        return false;

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
};

    

}

module.exports = RepaymentService;