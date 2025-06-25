import React from 'react';

function Footer() {
  return (
    <footer className="bg-black text-white px-2 md:px-4 py-6">
      <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto text-center md:text-left">
        <div>
          <strong className="text-lg">ADGIPS Hub</strong>
          <p className="text-gray-400 text-sm mt-1 md:mt-0">
            Built with ❤️ to help students excel in their careers.
          </p>
        </div>
        <p className="text-gray-400 text-sm mt-4 md:mt-0">
          © 2025 ECE Bois. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
