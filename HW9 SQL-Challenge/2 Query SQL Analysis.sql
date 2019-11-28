--1. List the following details of each employee: employee number, last name, first name, gender, and salary.
SELECT emp.emp_no, emp.first_name, emp.last_name, emp.gender, sal.salary
FROM employees AS emp
INNER JOIN salaries as sal 
ON emp.emp_no = sal.emp_no
LIMIT 100;

--2. List employees who were hired in 1986.
SELECT *
FROM employees
WHERE EXTRACT(YEAR FROM hire_date) = 1986;

--3. List the manager of each department with the following information: department number, department name, the manager's employee number, last name, first name, and start and end employment dates.
SELECT mgr.dept_no, dept.dept_name, mgr.emp_no, emp.last_name, emp.first_name, emp.hire_date, workhist.from_date, workhist.to_date
FROM dept_manager AS mgr
	INNER JOIN departments as dept
	ON mgr.dept_no = dept.dept_no
		INNER JOIN employees as emp
		ON mgr.emp_no = emp.emp_no
			INNER JOIN dept_emp as workhist
			ON mgr.emp_no = workhist.emp_no
WHERE (mgr.to_date BETWEEN SYMMETRIC CURRENT_DATE AND '9999-12-31')
	AND (workhist.to_date BETWEEN SYMMETRIC CURRENT_DATE AND '9999-12-31');

--4. List the department of each employee with the following information: employee number, last name, first name, and department name.
SELECT workhist.emp_no, emp.last_name, emp.first_name, dept.dept_name
FROM dept_emp as workhist
	INNER JOIN departments as dept
	ON workhist.dept_no = dept.dept_no
		INNER JOIN employees as emp
		ON workhist.emp_no = emp.emp_no
LIMIT 100;

--5. List all employees whose first name is "Hercules" and last names begin with "B."
SELECT *
FROM employees
WHERE UPPER(first_name) = 'HERCULES'
	AND last_name LIKE 'B%';

--6. List all employees in the Sales department, including their employee number, last name, first name, and department name.
SELECT workhist.emp_no, emp.last_name, emp.first_name, dept.dept_name
FROM dept_emp as workhist
	INNER JOIN departments as dept
	ON workhist.dept_no = dept.dept_no
		INNER JOIN employees as emp
		ON workhist.emp_no = emp.emp_no
WHERE UPPER(dept.dept_name) = 'SALES';

--7. List all employees in the Sales and Development departments, including their employee number, last name, first name, and department name.
SELECT workhist.emp_no, emp.last_name, emp.first_name, dept.dept_name
FROM dept_emp as workhist
	INNER JOIN departments as dept
	ON workhist.dept_no = dept.dept_no
		INNER JOIN employees as emp
		ON workhist.emp_no = emp.emp_no
WHERE (UPPER(dept.dept_name) = 'SALES'
	OR UPPER(dept.dept_name) = 'DEVELOPMENT');

--8.In descending order, list the frequency count of employee last names, i.e., how many employees share each last name
SELECT last_name, count(*) AS frequency
FROM employees
GROUP BY last_name;