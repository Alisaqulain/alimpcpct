import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#3b157a] text-white px-6 py-10 text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Return & Refund Policy */}
        <div
          className="h-[300px] overflow-y-scroll pr-2"
          style={{
            scrollbarWidth: "none",      // Firefox
            msOverflowStyle: "none"      // IE & Edge
          }}
        >
          <style>{`
            /* Chrome, Safari, Opera */
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          <h3 className="text-lg font-semibold mb-4">Return & Refund Policy</h3>
          <div className="text-gray-300 space-y-2 text-sm leading-relaxed">
            <p>1. The customers have <strong>7 days</strong> to check their purchases.</p>
            <p>2. If a customer is unsatisfied with the products, they must return them within <strong>7 days</strong> of the purchase. <strong>Mpcpct.com</strong> will refund all your money without any questions.</p>
            <p>3. The products must be returned within <strong>7 days</strong> under the following conditions:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>The condition of the purchase must be the same as it was at the time of purchase</li>
              <li>It must contain all tags</li>
              <li>It must not be damaged</li>
              <li>The customer must bring the purchase receipt</li>
            </ul>
            <p>4. After fourteen days of the purchase or not fulfilling any of the conditions provided in clause 3, <strong>Mpcpct.com</strong> shall not accept any return, and no money will be refunded.</p>
            <p>5. For more information regarding return and refund policy, please contact us.</p>
            <p className="mt-3">Thank you for choosing <strong>Mpcpct.com</strong>!</p>
          </div>
        </div>

        {/* Copyright */}
        <div>
          <h3 className="text-lg font-semibold mb-4">© Copyright - <span className="font-mono text-lg">Mpcpct.com</span></h3>
          <p className="text-gray-300">
            © 2025 <span className="font-mono">Mpcpct.com</span>. All rights reserved. The content, design, and materials on this website—including text, graphics, logos, and software—are the property of <span className="font-mono">Mpcpct.com</span> and protected under Indian and international copyright laws.
          </p>
          <p className="italic text-gray-400 mt-2">
            Unauthorized reproduction, distribution, or modification without prior written permission is strictly prohibited. For inquiries, contact us.
          </p>
          
          {/* Developer Credit - Added in a professional way */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-gray-400 text-xs">
              Developed by <span className="text-yellow-300 font-medium"><a href="https://robustwebsolution.com/">Robust Web Solution</a></span>
            </p>
          </div>
        </div>

        {/* Exam Hub */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Exam Preparation Hub</h3>
          <div className="grid grid-cols-2 gap-4">
            {["CPCT", "LDC", "SSC", "RSCIT"].map((exam) => (
              <div
                key={exam}
                className="flex items-center justify-center border border-gray-500 rounded-full px-3 py-5 bg-black"
              >
                <a href="/exam">
                  <div className="text-center">
                    <span className="block text-lg mt-1">{exam}</span>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Policy Links */}
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-gray-700">
        <h3 className="text-white font-semibold mb-4">Legal & Policies</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <a href="/refund" className="text-gray-300 hover:text-white hover:underline">
            Cancellation & Refunds
          </a>
          <span className="text-gray-600">|</span>
          <a href="/terms" className="text-gray-300 hover:text-white hover:underline">
            Terms and Conditions
          </a>
          <span className="text-gray-600">|</span>
          <a href="/shipping" className="text-gray-300 hover:text-white hover:underline">
            Shipping
          </a>
          <span className="text-gray-600">|</span>
          <a href="/privacy" className="text-gray-300 hover:text-white hover:underline">
            Privacy
          </a>
          <span className="text-gray-600">|</span>
          <a href="/contact-us" className="text-gray-300 hover:text-white hover:underline">
            Contact Us
          </a>
        </div>
      </div>

      {/* Mobile Enquiry */}
      <div className="max-w-7xl mx-auto mt-10">
        <h3 className="text-white font-semibold mb-2">Mobile Enquiry</h3>
        <div className="flex w-full max-w-md rounded-full overflow-hidden">
          <input
            type="text"
            placeholder="Enter Mobile"
            className="w-full px-4 py-2 text-white bg-[#3b157a] outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button className="bg-orange-400 px-6 py-2 text-black font-semibold">
            Send
          </button>
        </div>
      </div>
    </footer>
  );
}