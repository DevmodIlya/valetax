let dataFields = {};
const myCustomers = [];

const getValueById = (inputId) => {
    const input = document.getElementById(inputId);
    if (input) {
        return input.value;
    }
    return "";
}

const addNewCustomer = () => {
    dataFields = {
        customerName: getValueById("customerName"),
        receiveDate: getValueById("receiveDate") || new Date(),
        customerPhone: getValueById("customerPhone"),
        customerAddress: getValueById("customerAddress"),
        treatmentDescription: getValueById("treatmentDescription"),
    }

    myCustomers.push(dataFields);
}

addNewCustomer(); // Add new customer on submit

const getCustomerName = ()=>{
    alert(dataFields.customerName)
}

const getReceiveDate = ()=>{
    alert(dataFields.receiveDate)
}

const getTreatmentDescription = ()=>{
    alert(dataFields.treatmentDescription)
}
