var db = require("../config/db");
var log4js = require("../config/logger");
var datetime = require("node-datetime");
const moment = require('moment');
const Excel = require('exceljs');

var errorLogs = log4js.getLogger("errors"),
  debugLogs = log4js.getLogger("debugs");

var log_type = [];

module.exports = {
  salt: 10,
  LOW_PRIORITY: 1,
  STATUS_NEW: 1,
  PLANNER_DEPARTMENT_ID: 11,
  ADMINISTRATION: 2,
  INTERNAL_TECHNICIANS_ID: 9,
  EXTERNAL_TECHNICIANS_ID: 10,
  USER_DEPARTMENTS_CHECK_AVAILABLITY: [9, 10],
  INSTALLATION_TASK_TYPE: 2, //نصب وتركيب
  CASH_ACCOUNTS_TASK_TYPE: 7, // حسابات
  CUSTOMER_CARE_TASK_TYPE: 9, // خدمة الزبائن
  CUSTOMER_CARE_EXTERNAL_TASK_TYPE: 15, // خدمة الزبائن
  GOVERNORATE_OTHER: 1, // محافظة اخرى
  getDateTime: function getDateTime(date, format) {
    var dt = date ? datetime.create(date) : datetime.create();
    var formatted = format ? dt.format(format) : dt.format("y-m-d H:M:S");
    return formatted;
  },
  addDaysToDateString: function addDaysToDateString(date, days, format) {
    var dt = date ? datetime.create(date) : datetime.create();
    dt.offsetInDays(days);
    var formatted = format ? dt.format(format) : dt.format("y-m-d H:M:S");
    return formatted;
  },
  addHoursToDateString: function addHoursToDateString(date, hours, format) {
    var dt = date ? datetime.create(date) : datetime.create();
    dt.offsetInHours(hours);
    var formatted = format ? dt.format(format) : dt.format("y-m-d H:M:S");
    return formatted;
  },
  getDayOfWeekFromDate: function getDayOfWeekFromDate(date, format) {
    var dt = date ? datetime.create(date) : datetime.create();
    var formatted = format ? dt.format(format) : dt.format("Y-m-d H:M:S");
    var ddate = new Date(formatted);
    var dayOfWeek = ddate.getDay();
    return dayOfWeek;
  },

  formatQueryDate: function formatQueryDate(dateString) {
    const dateObj = new Date(dateString);

    const year = dateObj.getUTCFullYear();
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getUTCDate() + 1).padStart(2, '0');

    return `${year}-${month}-${day}`;
  },

  executeQuery: async function executeQuery(sql, logName, callback) {
    try {
      await db.query(
        {
          sql: sql,
          timeout: 40000,
        },
        (error, result) => {
          if (!error) {
            callback(result);
          } else {
            errorLogs.error(`${logName}sql: ${sql}`);
            errorLogs.error(logName + ": " + error);
            callback([false]);
          }
        }
      );
    } catch (e) {
      console.log("Error in common.js -> executeQuery: " + e);
    }
  },
  executeERPQuery: async function executeERPQuery(query, logName, callback) {
    // try{
    //     const result =  await dbERP.query(query)
    //     callback(result)
    // }
    // catch(e){
    //     errorLogs.error(`${logName}sql: ${sql}`)
    //             errorLogs.error(logName+": "+error)
    //             callback([false])
    // }
  },

  checkTokenValidate: function checkTokenValidate(token) { },
  getResponse: function getResponse(_status, _data, _message) {
    var data;
    if (_data) data = _data;
    else data = { message: _message };
    return {
      status: _status,
      data: data,
    };
  },
  validateCreationDateFrom: function validateCreationDateFrom(creation_date) {
    try {
      const regex = /^\d{4}-\d{2}-\d{2}$/; // regex to match "YYYY-MM-DD" format
      if (!regex.test(creation_date)) {
        // string does not match format
        return false;
      }
      const date = new Date(creation_date);
      if (isNaN(date.getTime())) {
        // invalid date string
        return false;
      }
      return true;
    } catch (error) {
      console.log("validate date error", error);
      return false;
    }
  },
  validateCreationDateTimeFrom: function validateCreationDateTimeFrom(creation_date) {
    try {
      const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/; // regex to match "YYYY-MM-DD HH:mm:ss" format
      if (!regex.test(creation_date)) {
        // string does not match format
        return false;
      }
      const date = new Date(creation_date);
      if (isNaN(date.getTime())) {
        // invalid date string
        return false;
      }
      return true;
    } catch (error) {
      console.log("validate date error", error);
      return false;
    }
  },
  extractNumbers: function extractNumbers(str) {
    const arabicNumbers = {
      "٠": "0",
      "١": "1",
      "٢": "2",
      "٣": "3",
      "٤": "4",
      "٥": "5",
      "٦": "6",
      "٧": "7",
      "٨": "8",
      "٩": "9",
    };
    let strAllArabicNumbers = "";
    for (let i = 0; i < str?.length; i++) {
      const char = str[i];
      if (arabicNumbers[char]) {
        strAllArabicNumbers += arabicNumbers[char];
      } else {
        strAllArabicNumbers += char;
      }
    }
    let longestSequence = "";
    let currentSequence = "";

    for (let i = 0; i < strAllArabicNumbers.length; i++) {
      const char = strAllArabicNumbers[i];


      if (!isNaN(char) && char !== " ") {
        // if it's a number, add it to the current sequence
        currentSequence += char;
      } else {
        // if it's not a number, compare the current sequence to the longest sequence
        if (currentSequence.length > longestSequence.length) {
          longestSequence = currentSequence;
        }
        currentSequence = "";
      }
    }

    // check if the last sequence was the longest
    if (currentSequence.length > longestSequence.length) {
      longestSequence = currentSequence;
    }

    return longestSequence;
  },
  isTimeInThePastMinutes: function isTimeInThePastMinutes(timestamp, minutes) {
    try {
      timestamp = parseInt(timestamp)
    } catch (error) {
      console.log("error in parse int timestamp", timestamp);
      return false
    }
    var currentDate = new Date();
    const currentTimestamp = Math.floor(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), currentDate.getUTCHours(), currentDate.getUTCMinutes(), currentDate.getUTCSeconds()) / 1000);

    const MinutesAgo = currentTimestamp - (minutes * 60); // Adjust for the server's timezone offset


    return timestamp >= MinutesAgo && timestamp <= currentTimestamp;
  },
  timestampZeroGMTToDatetimePlusThree: function timestampZeroGMTToDatetimePlusThree(timestamp) {
    // Assume you have a timestamp in milliseconds
    // const timestamp = 1622898600000;

    // Create a new Date object using the timestamp
    try {

      const timestampInMiliseconds = parseInt(timestamp)

      const date = new Date(timestampInMiliseconds);
      if (!isNaN(date)) {
        // Add 3 hours to the UTC time
        date.setUTCHours(date.getUTCHours() + 3);
        // Extract the various components of the updated date and time
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1; // months are zero-based
        const day = date.getUTCDate();
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const seconds = date.getUTCSeconds();

        // Construct the formatted date and time string
        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        return formattedDateTime
      }
      else {
        return ""
      }
    } catch (error) {

    }
    return ""

  },
  extractLetter: function extractLetter(str) {
    const letterMatch = str?.match(/[\p{L}]/u);
    if (letterMatch) {
      return letterMatch[0];
    } else {
      return null;
    }
  },
  convertDateStringToTimestamp: function convertDateStringToTimestamp(dateString) {
    try {
      const timeStamp = moment.utc(dateString).utcOffset('+03:00').unix();
      return timeStamp
    } catch (error) {
      return 0
    }

  },
  getNearestToTimeStamp: function getNearestToTimeStamp(transactiondatetimeString, data, differenceInHours = 3) {
    try {

      debugLogs.debug(`getNearestFromToTime transactiondatetimeString ${JSON.stringify(transactiondatetimeString)}`)
      const transactionCreatedAtTimestamp = moment.utc(transactiondatetimeString).utcOffset('+03:00').unix();
      debugLogs.debug(`getNearestFromToTime transactionCreatedAtTimestamp ${JSON.stringify(transactionCreatedAtTimestamp)}`)
      debugLogs.debug(`getNearestFromToTime data ${JSON.stringify(data)}`)
      // const transactionCreatedAtTimestamp = 1687084800; // Replace with your transactionCreatedAtTimestamp value

      const nearestObject = data.reduce((nearest, item) => {
        const timestamp = item.c[0].v;
        const diff = Math.abs(timestamp - transactionCreatedAtTimestamp);

        if (diff <= differenceInHours * 60 * 60) { // 3 hours in seconds (3 * 60 * 60)
          if (!nearest || diff < nearest.diff) {
            return { item, diff };
          }
        }

        return nearest;
      }, null);
      debugLogs.debug(`getNearestFromToTime nearestObject ${JSON.stringify(nearestObject)}`)
      return nearestObject
    } catch (error) {
      console.log("getNearestToTimeStamp", error);
      return false
    }

  },
  checkDatetimeFormat: function checkDatetimeFormat(datetimeStr) {
    // Regular expressions for matching the desired formats
    const regexYYYYMMDD = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    const regexDDMMYY = /^\d{2}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?$/;
    if (regexYYYYMMDD.test(datetimeStr)) {
      // Perform action for "YYYY-MM-DD HH:mm:ss" format
      return 1
      // Do something
    } else if (regexDDMMYY.test(datetimeStr)) {
      // Perform action for "DD-MM-YY HH:mm:ss" format
      return 2
      // Do something else
    } else if (regex.test(datetimeStr)) {
      // Perform action for "YYYY-MM-DDTHH:mm:ss.sss" format
      return 3
      // Do something else
    } else {
      // Invalid format
      return 0
    }
  },
  isNumericIntegerBetween21And24: function isNumericIntegerBetween21And24(str) {
    // Regular expression to match numeric integers
    const numericRegex = /^[0-9]+$/;
    // Check if the string matches the numeric regex and if its value is between 21 and 24
    return numericRegex.test(str) && parseInt(str, 10) >= 21 && parseInt(str, 10) <= 24;
  },
  getPlateType: function getPlateType(input) {

    // Regular expressions to match each pattern
    const pattern1 = /^\d{2}[A-Za-z]\d+$/; // Two digits, a letter, then numbers
    const pattern2 = /^[A-Za-z]\d+$/;       // One letter, then numbers
    const pattern3 = /^\d+$/;               // Only numbers

    let type = 0
    if (pattern1.test(input)) {
      type = 1//"Type 1 (new): Two digits, a letter, then numbers";
    } else if (pattern2.test(input)) {
      type = 2//"Type 2 (German): One letter, then numbers";
    } else if (pattern3.test(input)) {
      type = 3 //"Type 3(old): Only numbers";
    } else {
      type = 0//"Unknown type";
    }

    return type

  },
  getPlateTypeName: function getPlateTypeName(input) {

    // Regular expressions to match each pattern
    const pattern1 = /^\d{2}[A-Za-z]\d+$/; // Two digits, a letter, then numbers
    const pattern2 = /^[A-Za-z]\d+$/;       // One letter, then numbers
    const pattern3 = /^\d+$/;               // Only numbers

    let type = ""
    if (pattern1.test(input)) {
      type = "جديد"//"Type 1 (new): Two digits, a letter, then numbers";
    } else if (pattern2.test(input)) {
      type = "الماني"//"Type 2 (German): One letter, then numbers";
    } else if (pattern3.test(input)) {
      type = "قديم" //"Type 3(old): Only numbers";
    } else {
      type = "غير معروف"//"Unknown type";
    }

    return type

  },
  convertArabicToEnglish: function convertArabicToEnglish(input) {
    // Mapping object for Arabic to English letters
    const arabicToEnglishMap = {
      'ا': 'A',
      'أ': 'A',
      'ب': 'B',
      'ج': 'J',
      'د': 'D',
      'ر': 'R',
      'س': 'S',
      'ط': 'T',
      'ف': 'F',
      'ك': 'K',
      'م': 'M',
      'ن': 'N',
      'ه': 'H',
      'و': 'W',
      'ي': 'E',
      'ل': 'L',
      'ز': 'Z',
      'ق': 'Q'
    };

    // Convert Arabic letters to English based on the mapping
    let output = '';
    for (let i = 0; i < input?.length; i++) {
      const char = input[i];
      if (arabicToEnglishMap.hasOwnProperty(char)) {
        output += arabicToEnglishMap[char];
      } else {
        output += char; // Keep non-Arabic characters unchanged
      }
    }


    return output;
  },
 
  checkIfDateTimeInRange: function checkIfDateTimeInRange(datetime, rangeInMinutes = 30) {
    try {

      debugLogs.debug(`checkIfDateTimeInRange ${JSON.stringify(datetime)}`)
      const datetimetamp = moment.utc(datetime).unix();
      debugLogs.debug(`checkIfDateTimeInRange datetimestamp ${JSON.stringify(datetimetamp)}`)
      const dateNow = moment().format("YYYY-MM-DD HH:mm:ss")
      const nowTimeStamp = moment.utc(dateNow).unix();
      const diff = Math.abs(nowTimeStamp - datetimetamp);
      let inRange = false
      if (diff < rangeInMinutes * 60) { // 30 minuts in seconds (30  * 60)
        inRange = true
      }
      debugLogs.debug(`checkIfDateTimeInRange transaction date ${inRange ? "in range" : "out of range"} difference ${diff}`)
      return inRange
    } catch (error) {
      console.log("checkIfDateTimeInRange", error);
      return false
    }

  },
  tryParseDate: function tryParseDate(dateString) {
    // Attempt flexible parsing with a wide array of formats
    const parsedDate = moment(dateString, moment.ISO_8601, true);

    if (parsedDate.isValid()) {
      // If parsed successfully, return formatted YYYY-MM-DD string
      return parsedDate.format('YYYY-MM-DD');
    } else {
      // If parsing fails, revert to Date.parse() for basic compatibility
      const parsedNative = Date.parse(dateString);
      if (!isNaN(parsedNative)) {
        // If Date.parse() succeeds, format as YYYY-MM-DD
        const nativeDate = new Date(parsedNative);
        return nativeDate.toISOString().slice(0, 10);
      } else {
        // If both parsing attempts fail, return null
        return null;
      }
    }
  },
  readExcel: async function readExcel(filePath) {
    try {
      const workbook = new Excel.Workbook();
      await workbook.xlsx.readFile(filePath);

      const worksheet = workbook.worksheets[0]; // Assuming you're reading the first sheet

      const rows = [];
      worksheet.eachRow((row, rowNumber) => {
        const rowData = [];
        row.eachCell({ includeEmpty: true }, (cell) => {
          rowData.push(cell.value);
        });
        rows.push(rowData);
      });

      return rows;
    } catch (error) {
      throw new Error('Error reading Excel file:', error);
    }
  },

  log_type: log_type,
};
