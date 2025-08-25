#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// إعداد واجهة القراءة
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ألوان للتحسين البصري
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// التحقق من اسم المشروع
const projectName = process.argv[2];
if (!projectName) {
  console.error(`${colors.red}Please provide a project name:${colors.reset} node create_vite_react.js MyApp`);
  process.exit(1);
}

// التحقق من صحة اسم المشروع
if (!/^[a-z0-9-]+$/i.test(projectName)) {
  console.error(`${colors.red}Invalid project name! Use only letters, numbers, and hyphens.${colors.reset}`);
  process.exit(1);
}

// التحقق مما إذا كان المجلد موجودًا بالفعل
if (fs.existsSync(projectName)) {
  rl.question(`${colors.yellow}Directory "${projectName}" already exists. Overwrite? (y/N): ${colors.reset}`, (answer) => {
    if (answer.toLowerCase() !== 'y') {
      console.log(`${colors.yellow}Operation cancelled.${colors.reset}`);
      rl.close();
      process.exit(0);
    } else {
      createProject();
    }
  });
} else {
  createProject();
}

function createProject() {
  console.log(`${colors.blue}🚀 Creating Vite + React project '${projectName}'...${colors.reset}`);
  
  try {
    // إنشاء المجلد الرئيسي
    if (!fs.existsSync(projectName)) {
      fs.mkdirSync(projectName, { recursive: true });
    }

    // الانتقال إلى المجلد
    process.chdir(projectName);

    // إنشاء تطبيق Vite + React
    console.log(`${colors.blue}📦 Creating Vite + React app...${colors.reset}`);
    execSync('npm create vite@latest . -- --template react', { 
      stdio: 'inherit'
    });

    // تثبيت dependencies الأساسية
    console.log(`${colors.blue}📦 Installing dependencies...${colors.reset}`);
    execSync('npm install', { stdio: 'inherit' });

    console.log(`${colors.green}✓ Vite + React project created successfully!${colors.reset}`);

    // تثبيت Tailwind CSS ومكتبات UI مهمة
    console.log(`${colors.blue}🎨 Installing Tailwind CSS and UI libraries...${colors.reset}`);
    
    const packages = [
      // Tailwind CSS
      'tailwindcss',
      'postcss',
      'autoprefixer',
      '@tailwindcss/forms',
      '@tailwindcss/typography',
      
      // مكتبات UI وتنسيق
      'react-router-dom',
      'axios',
      'lucide-react', // أيقونات
      'clsx', // دمج classes
      'tailwind-merge', // دمج classes تيلويند
      
      // إدارة الحالة
      'zustand',
      '@tanstack/react-query',
      
      // النماذج والتحقق
      'react-hook-form',
      '@hookform/resolvers',
      'zod',
      
      // أدوات التطوير
      'prettier',
      'prettier-plugin-tailwindcss'
    ];

    execSync(`npm install -D ${packages.join(' ')}`, { stdio: 'inherit' });

    // تهيئة Tailwind CSS
    console.log(`${colors.blue}⚙️  Initializing Tailwind CSS...${colors.reset}`);
    execSync('npx tailwindcss init -p', { stdio: 'inherit' });

    // إنشاء هيكل مجلدات إضافي
    createAdditionalStructure();

    // تحديث ملفات التكوين
    updateConfigurationFiles();

    // تحديث ملف App.jsx الرئيسي
    updateAppFile();

    console.log(`${colors.green}✓ All packages installed successfully!${colors.reset}`);
    console.log(`${colors.green}✓ Project setup completed!${colors.reset}`);
    
    showNextSteps();

  } catch (error) {
    console.error(`${colors.red}❌ Failed to create Vite React project:${colors.reset}`, error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

function createAdditionalStructure() {
  const folders = [
    'src/components/ui',
    'src/components/forms',
    'src/components/layout',
    'src/pages',
    'src/hooks',
    'src/utils',
    'src/services',
    'src/types',
    'src/store',
    'src/contexts',
    'src/assets/images',
    'src/assets/styles',
    'src/lib'
  ];

  folders.forEach(folder => {
    const folderPath = path.join(process.cwd(), folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      fs.writeFileSync(path.join(folderPath, '.gitkeep'), '');
    }
  });

  // إنشاء ملفات إضافية
  createExampleFiles();
}

function updateConfigurationFiles() {
  // تحديث tailwind.config.js
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}`;

  fs.writeFileSync('tailwind.config.js', tailwindConfig);

  // تحديث postcss.config.js
  const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;

  fs.writeFileSync('postcss.config.js', postcssConfig);

  // تحديث vite.config.js
  const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})`;

  fs.writeFileSync('vite.config.js', viteConfig);

  // تحديث index.css لإضافة تيلويند
  const cssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');

@layer base {
  html {
    font-family: 'Inter', system-ui, sans-serif;
  }
  
  body {
    @apply antialiased;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
  }
  
  .btn-secondary {
    @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200;
  }
  
  .card {
    @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
  }
}`;

  fs.writeFileSync('src/index.css', cssContent);
}

function updateAppFile() {
  const appContent = `import './App.css'
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Home, About, Contact } from './pages'
import { Button } from './components/ui/Button'

function HomePage() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to {projectName}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Built with Vite, React, Tailwind CSS, and modern development tools
          </p>
          
          <div className="flex justify-center gap-4 mb-12">
            <Button onClick={() => setCount(count + 1)}>
              Count is {count}
            </Button>
            <Button variant="secondary" as={Link} to="/about">
              Learn More
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card">
              <h3 className="text-lg font-semibold mb-2">⚡ Vite</h3>
              <p className="text-gray-600">Fast build tool and dev server</p>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold mb-2">🎨 Tailwind</h3>
              <p className="text-gray-600">Utility-first CSS framework</p>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold mb-2">🚀 React</h3>
              <p className="text-gray-600">Modern UI library</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  )
}

export default App
`;

  fs.writeFileSync('src/App.jsx', appContent);
}

function createExampleFiles() {
  // إنشاء مكون Button
  const buttonComponent = `import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = ({ 
  children, 
  variant = 'primary', 
  className, 
  as: Component = 'button',
  ...props 
}) => {
  const baseClasses = 'font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  };

  const classes = twMerge(
    clsx(baseClasses, variants[variant], className)
  );

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};`;

  fs.writeFileSync('src/components/ui/Button.jsx', buttonComponent);

  // إنشاء صفحات مثال
  const aboutPage = `export function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">About Us</h1>
          <div className="card">
            <p className="text-lg text-gray-600">
              This is a modern React application built with Vite and Tailwind CSS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}`;

  const contactPage = `export function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact</h1>
          <div className="card">
            <p className="text-lg text-gray-600">
              Contact us at: example@email.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}`;

  const homePage = `export function Home() {
  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
}`;

  fs.writeFileSync('src/pages/About.jsx', aboutPage);
  fs.writeFileSync('src/pages/Contact.jsx', contactPage);
  fs.writeFileSync('src/pages/Home.jsx', homePage);

  // إنشاء ملف index للصفحات
  const pagesIndex = `export { Home } from './Home';\nexport { About } from './About';\nexport { Contact } from './Contact';`;
  fs.writeFileSync('src/pages/index.js', pagesIndex);

  // إنشاء ملف hooks مثال
  const useLocalStorage = `import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(\`Error setting localStorage key "\${key}":\`, error);
    }
  };

  return [storedValue, setValue];
}`;

  fs.writeFileSync('src/hooks/useLocalStorage.js', useLocalStorage);

  // إنشاء ملف env مثال
  const envExample = `VITE_API_URL=http://localhost:3001
VITE_APP_NAME=${projectName}
VITE_APP_VERSION=1.0.0`;

  fs.writeFileSync('.env.example', envExample);
}

function showNextSteps() {
  console.log(`\n${colors.magenta}🌈 Next steps:${colors.reset}`);
  console.log(`${colors.cyan}  cd ${projectName}${colors.reset}`);
  console.log(`${colors.cyan}  npm run dev${colors.reset}`);
  console.log(`\n${colors.yellow}📦 Installed packages:${colors.reset}`);
  console.log(`  • ⚡ Vite (fast build tool)`);
  console.log(`  • ⚛️  React 18`);
  console.log(`  • 🎨 Tailwind CSS with plugins`);
  console.log(`  • 🛣️  React Router DOM`);
  console.log(`  • 🐻 Zustand (state management)`);
  console.log(`  • 📡 React Query (server state)`);
  console.log(`  • 📝 React Hook Form + Zod`);
  console.log(`  • 🔮 Lucide React (icons)`);
  console.log(`  • 🎯 Axios (HTTP client)`);
  console.log(`\n${colors.green}🎉 Happy coding with Vite + React! 🚀${colors.reset}`);
}