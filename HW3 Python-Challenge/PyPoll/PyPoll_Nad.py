# Import Modules
import os
import csv

def countX(lst, x): 
    return lst.count(x) 
    
def SortDescending(sub_li): 
    l = len(sub_li) 
    for i in range(0, l): 
        for j in range(0, l-i-1): 
            if (sub_li[j][1] < sub_li[j + 1][1]): 
                temp = sub_li[j] 
                sub_li[j]= sub_li[j + 1] 
                sub_li[j + 1]= temp
    return sub_li 
    
# Defining path, file to open and file to write
filename = 'election_data.csv'
file_to_output = os.path.join("AnalysisOutput.txt")
csvpath = os.path.join('Resources', filename)

# Initial Calculated variables
PollResults = []
SummaryResults = []

# Part 1 - Compiling a List of Poll Results  
# Read csv file with module
with open(csvpath, newline='') as csvfile:
    # CSV reader specifies delimiter and variable that holds contents
    csvreader = csv.reader(csvfile, delimiter=',')
    csv_header = next(csvreader)
    # Create new list containing PollResults only
    for row in csvreader:
        PollResults.append((row[2]))

# Part 2 - Counting Poll Result per Candidate, Calculate Percent, Make into a list of SummaryResults
# Create a list of unique Candidates
UniqueCandidates = list(set(PollResults))
NumberOfCandidates = int(len(UniqueCandidates))

# Looping to calculate number of Votes for each PollResults
for i in range(NumberOfCandidates):
    NumberofVotes = countX(PollResults, UniqueCandidates[i])
    Percent = round(NumberofVotes/len(PollResults)*100)
    
    # Create a new list for Results containing name, percent votes and number of votes
    SummaryResults.append([UniqueCandidates[i], Percent, NumberofVotes])

#print(SummaryResults)

# Part 3 - Once Result is create, Sort ResultList based on count Poll
# Sort Result by Calling SortDescending function defined above  
SortedResults = SortDescending(SummaryResults)

# Part 4 - Generating output for print in terminal and write in txt file

# Gathering Opening and Closing output
Opening = (
    f"Election Results\n"
    f"------------------------------------\n"
    f"Total Votes: {str(len(PollResults))}\n"
    f"------------------------------------\n")
Closing = (
    f"------------------------------------\n"
    f"Winner : {SortedResults[0][0]}\n"
    f"------------------------------------\n")

# Print all of the results (to terminal)    
print(Opening)

# Print sorted results
for i in range(NumberOfCandidates):
     print(f"{SortedResults[i][0]}: {SortedResults[i][1]}% ({SortedResults[i][2]})")

print(Closing)

# Save the results to AnalysisOutput text file
with open(file_to_output, "w") as txt_file:
    txt_file.writelines(Opening)
    for i in range(NumberOfCandidates):
        txt_file.writelines(f"{SortedResults[i][0]}: {SortedResults[i][1]}% ({SortedResults[i][2]})\n")
    txt_file.writelines(Closing)