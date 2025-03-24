'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Link from 'next/link';

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function MobileMenu({ isOpen, setIsOpen }: MobileMenuProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 lg:hidden"
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="modal-backdrop" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="transition ease-out duration-300 transform"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in duration-200 transform"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <Dialog.Panel className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <Dialog.Title className="text-xl font-bold text-gray-900">
                  Menu
                </Dialog.Title>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 -m-2 text-gray-500 hover:text-gray-700 transition-colors focus-ring rounded-lg"
                >
                  <span className="sr-only">Close menu</span>
                  <div className="relative w-5 h-5">
                    <div className="absolute top-1/2 left-0 w-5 h-0.5 bg-current transform rotate-45"></div>
                    <div className="absolute top-1/2 left-0 w-5 h-0.5 bg-current transform -rotate-45"></div>
                  </div>
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="nav-link flex items-center w-full px-4 py-3 rounded-lg hover:bg-gray-50 hover-card"
                >
                  <span className="text-lg">Home</span>
                </Link>
                <Link
                  href="/bookings"
                  onClick={() => setIsOpen(false)}
                  className="nav-link flex items-center w-full px-4 py-3 rounded-lg hover:bg-gray-50 hover-card"
                >
                  <span className="text-lg">My Bookings</span>
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="nav-link flex items-center w-full px-4 py-3 rounded-lg hover:bg-gray-50 hover-card"
                >
                  <span className="text-lg">Profile</span>
                </Link>
              </nav>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    // Add your booking form open logic here
                  }}
                  className="btn btn-primary w-full py-3 text-lg font-medium hover-card"
                >
                  Book Now
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
} 