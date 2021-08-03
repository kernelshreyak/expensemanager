import sqlite3

con = sqlite3.connect('expensedata.sqlite')
cur = con.cursor()


def view_account_balance(accid = 1):
	credits = cur.execute("SELECT sum(amount) FROM transactions where toacc={}".format(accid))
	credits = next(credits)
	try:
		credits = float(credits[0])
	except:
		credits = 0.0

	debits = cur.execute("SELECT sum(amount) FROM transactions where fromacc={}".format(accid))
	debits = next(debits)
	try:
		debits = float(debits[0])
	except:
		debits = 0.0

	print("A/C Balance for Account {} is {}".format(accid,credits - debits))


def get_last_id():
	data = cur.execute('SELECT ID FROM transactions order by ID DESC LIMIT 0,1')
	data = next(data)
	return data[0] + 1

def add_transaction():
	print("\nAdding new transaction")

	idval = get_last_id()
	print("Transaction ID: ",idval)
	amount = float(input("Amount: "))
	transactiondate = input("Date: ")
	categorytype = input("Category Type: ")
	categoryname = input("Category Name: ")
	note = input("Note: ")
	fromacc = int(input("From A/C: "))
	toacc = int(input("To A/C: "))
	
	cur.execute("INSERT INTO transactions VALUES ({},'{}','{}','{}','{}',{},{},{},{})".format(idval,transactiondate,categorytype,categoryname,note,amount,fromacc,toacc,0))
	con.commit()
	print("transaction entered successfully!")




print("------------------Expense Manager CLI-------------------")
print("1.Add Transaction")
print("2.View A/C Balance")

try:
	choice = input("Enter choice:")
	choice = int(choice)
	if choice == 1:
		add_transaction()
	elif choice == 2:
		accid = int(input("\nA/C ID: "))
		view_account_balance(accid)
	else:
		print("Invalid choice!")

except KeyboardInterrupt:
	
	print("\nExitting...")

