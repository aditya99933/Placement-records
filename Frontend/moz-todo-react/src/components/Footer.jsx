import React from 'react'
import { Twitter, Linkedin, Github } from 'lucide-react'

function Footer() {
  return (
   <footer className="bg-gray-900 text-white p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="md:col-span-2">
              <strong className="text-lg">Adgips Hub</strong>
              <p className="text-gray-400 mt-2">Your complete tech career platform. Find jobs, build community, share knowledge, and learn new skills.</p>
            </div>
            <div>
              <a href="#" className="block text-gray-400 hover:text-white mb-2">About</a>
              <a href="#" className="block text-gray-400 hover:text-white mb-2">Contact</a>
              <a href="#" className="block text-gray-400 hover:text-white mb-2">Terms of Services</a>
              <a href="#" className="block text-gray-400 hover:text-white">Privacy Policy</a>
            </div>
            <div>
              <span className="block text-gray-400 mb-3">Follow Us</span>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://www.linkedin.com/in/tanishq-garg-27a290258/" className="text-gray-400 hover:text-white transition">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://github.com/Tanishqdevop03" className="text-gray-400 hover:text-white transition">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-4">
            <p className="text-gray-400 text-center">© 2025 AdgipsHub. All rights reserved.</p>
          </div>
        </footer>
  )
}

export default Footer