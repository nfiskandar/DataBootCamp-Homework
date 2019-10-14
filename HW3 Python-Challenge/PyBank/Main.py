# Import Modules
import os
import csv

# Defining path, file to open and file to write
filename = 'budget_data.csv'
file_to_output = os.path.join("AnalysisOutput.txt")
csvpath = os.path.join('Resources', filename)

# Initial Calculated variables
ProfitLoss = []
Date = []
Change = []
    
# Read csv file with module

with open(csvpath, newline='') as csvfile:

    # CSV reader specifies delimiter and variable that holds contents
    csvreader = csv.reader(csvfile, delimiter=',')

    # Read the header row first (skip this step if there is now header)
    csv_header = next(csvreader)

    # Read each row of data after the header in the file and put it in a list for every column
    for row in csvreader:
        ProfitLoss.append(float(row[1]))
        Date.append(row[0])
 
# Calculate the change in ProfitLoss data (difference between row and previous row
for i in range(1,len(ProfitLoss)):
    Change.append(ProfitLoss[i]-ProfitLoss[i-1])

# Calculate average, Maximum and Minimum Change 
AverageChange = round(sum(Change)/len(Change),2)
MaxChange = round(max(Change))
MinChange = round(min(Change))

# Find Date based on index of Max and Min Change
MaxChangeDate = (Date[Change.index(MaxChange)])
MinChangeDate = (Date[Change.index(MinChange)])
     
# Generating output for print in terminal and write in txt file     
output = (
    f"Financial Analysis\n"
    f"---------------------------------------------------\n"
    f"Total Months: {str(len(Date))}\n"
    f"Total: ${str(round(sum(ProfitLoss)))}\n"
    f"Average Change: ${str(AverageChange)}\n"
    f"Greatest Increse in Profits: {MaxChangeDate} (${MaxChange})\n"
    f"Greatest Decrease in Profits: {MinChangeDate} (${MinChange})\n")
    
# Print all of the results (to terminal)
print(output)

# Save the results to AnalysisOutput text file
with open(file_to_output, "a") as txt_file:
    txt_file.writelines(output)
