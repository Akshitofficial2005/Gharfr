#!/bin/bash

# Quick fix for ESLint unused imports
echo "Fixing ESLint unused imports..."

# Fix AdminDashboard.tsx
sed -i 's/import { Link }/\/\/ import { Link }/' src/pages/AdminDashboard.tsx
sed -i 's/, AlertTriangle/, \/\/ AlertTriangle/' src/pages/AdminDashboard.tsx
sed -i 's/, Clock/, \/\/ Clock/' src/pages/AdminDashboard.tsx  
sed -i 's/, Edit/, \/\/ Edit/' src/pages/AdminDashboard.tsx
sed -i 's/, Trash2/, \/\/ Trash2/' src/pages/AdminDashboard.tsx
sed -i 's/, Search/, \/\/ Search/' src/pages/AdminDashboard.tsx
sed -i 's/, Upload/, \/\/ Upload/' src/pages/AdminDashboard.tsx
sed -i 's/, Shield/, \/\/ Shield/' src/pages/AdminDashboard.tsx
sed -i 's/, PieChart/, \/\/ PieChart/' src/pages/AdminDashboard.tsx
sed -i 's/, MapPin/, \/\/ MapPin/' src/pages/AdminDashboard.tsx
sed -i 's/, Star/, \/\/ Star/' src/pages/AdminDashboard.tsx
sed -i 's/, Flag/, \/\/ Flag/' src/pages/AdminDashboard.tsx
sed -i 's/, FileText/, \/\/ FileText/' src/pages/AdminDashboard.tsx
sed -i 's/, CreditCard/, \/\/ CreditCard/' src/pages/AdminDashboard.tsx
sed -i 's/, Gift/, \/\/ Gift/' src/pages/AdminDashboard.tsx
sed -i 's/, Target/, \/\/ Target/' src/pages/AdminDashboard.tsx
sed -i 's/, Zap/, \/\/ Zap/' src/pages/AdminDashboard.tsx
sed -i 's/, Award/, \/\/ Award/' src/pages/AdminDashboard.tsx
sed -i 's/, Pie/, \/\/ Pie/' src/pages/AdminDashboard.tsx

echo "ESLint fixes applied!"
