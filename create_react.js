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
  console.error(`${colors.red}Please provide a project name:${colors.reset} node create_react.js MyApp`);
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
  console.log(`${colors.blue}🚀 Creating React project '${projectName}'...${colors.reset}`);
  
  try {
    // إنشاء المجلد الرئيسي
    if (!fs.existsSync(projectName)) {
      fs.mkdirSync(projectName, { recursive: true });
    }

    // الانتقال إلى المجلد
    process.chdir(projectName);

    // إنشاء تطبيق React مع TypeScript
    console.log(`${colors.blue}📦 Running create-react-app with TypeScript...${colors.reset}`);
    execSync('npx create-react-app . --template typescript', { 
      stdio: 'inherit',
      env: { ...process.env, ADBLOCK: '1', DISABLE_OPENCOLLECTIVE: '1' }
    });

    console.log(`${colors.green}✓ React project created successfully!${colors.reset}`);

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
      'styled-components',
      '@types/styled-components',
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
      '@types/node',
      'prettier',
      'prettier-plugin-tailwindcss'
    ];

    execSync(`npm install ${packages.join(' ')}`, { stdio: 'inherit' });

    // تهيئة Tailwind CSS
    console.log(`${colors.blue}⚙️  Initializing Tailwind CSS...${colors.reset}`);
    execSync('npx tailwindcss init -p', { stdio: 'inherit' });

    // إنشاء هيكل مجلدات إضافي
    createAdditionalStructure();

    // تحديث ملفات التكوين
    updateConfigurationFiles();

    console.log(`${colors.green}✓ All packages installed successfully!${colors.reset}`);
    console.log(`${colors.green}✓ Project setup completed!${colors.reset}`);
    
    showNextSteps();

  } catch (error) {
    console.error(`${colors.red}❌ Failed to create React project:${colors.reset}`, error.message);
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
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
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

  // تحديث package.json بإضافة scripts
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  packageJson.scripts = {
    ...packageJson.scripts,
    "format": "prettier --write .",
    "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
    "build:prod": "npm run build",
    "dev": "npm start"
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

function createExampleFiles() {
  // إنشاء ملف hooks مثال
  const useLocalStorage = `import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(\`Error setting localStorage key "\${key}":\`, error);
    }
  };

  return [storedValue, setValue] as const;
}`;

  fs.writeFileSync('src/hooks/useLocalStorage.ts', useLocalStorage);

  // إنشاء ملف utils مثال
  const utils = `export function classNames(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}`;

  fs.writeFileSync('src/utils/helpers.ts', utils);

  // إنشاء ملف env مثال
  const envExample = `REACT_APP_API_URL=http://localhost:3001
REACT_APP_VERSION=1.0.0
REACT_APP_NAME=${projectName}
REACT_APP_ENV=development`;

  fs.writeFileSync('.env.example', envExample);
}

function showNextSteps() {
  console.log(`\n${colors.magenta}🌈 Next steps:${colors.reset}`);
  console.log(`${colors.cyan}  cd ${projectName}${colors.reset}`);
  console.log(`${colors.cyan}  npm start${colors.reset}`);
  console.log(`\n${colors.yellow}📦 Installed packages:${colors.reset}`);
  console.log(`  • Tailwind CSS with Forms & Typography`);
  console.log(`  • React Router DOM`);
  console.log(`  • Axios for API calls`);
  console.log(`  • Zustand for state management`);
  console.log(`  • React Query for server state`);
  console.log(`  • React Hook Form + Zod for forms`);
  console.log(`  • Lucide React for icons`);
  console.log(`  • Prettier for formatting`);
  console.log(`\n${colors.green}🎉 Happy coding with your enhanced React stack! 🚀${colors.reset}`);
}