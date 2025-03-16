import React from "react";
import { Link } from "react-router-dom";

const TermsPage = () => {
  return (
    <div className="py-12 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

          <div className="prose prose-lg max-w-none">
            <p className="mb-4">Last Updated: March 15, 2025</p>

            <p className="mb-4">
              Welcome to crAIvings. These Terms of Service ("Terms") govern your
              access to and use of our website, services, and applications
              (collectively, the "Service"). By using our Service, you agree to
              be bound by these Terms.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using our Service, you confirm that you accept
              these Terms and agree to comply with them. If you do not agree
              with these Terms, you must not access or use our Service.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-4">
              2. Changes to Terms
            </h2>
            <p>
              We may revise these Terms at any time by updating this page. It is
              your responsibility to check this page periodically for changes.
              Your continued use of or access to our Service following the
              posting of any changes constitutes acceptance of those changes.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-4">
              3. User Accounts
            </h2>
            <p>
              When you create an account with us, you must provide accurate,
              complete, and current information. You are responsible for
              safeguarding the password that you use to access the Service and
              for any activities or actions under your password.
            </p>
            <p>
              You agree not to disclose your password to any third party. You
              must notify us immediately upon becoming aware of any breach of
              security or unauthorized use of your account.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-4">4. User Content</h2>
            <p>
              Our Service allows you to post, submit, and share content,
              including reviews, ratings, and comments about restaurants ("User
              Content"). By posting User Content, you grant us a non-exclusive,
              worldwide, royalty-free license to use, reproduce, modify, adapt,
              publish, translate, and distribute your User Content.
            </p>
            <p>
              You are solely responsible for the User Content that you post and
              warrant that:
            </p>
            <ul className="list-disc pl-8 my-4">
              <li>
                You own or have the necessary rights to the User Content you
                post
              </li>
              <li>The User Content is accurate and not misleading</li>
              <li>
                The User Content does not violate these Terms, applicable law,
                or the rights of any third party
              </li>
              <li>The User Content is not defamatory, obscene, or offensive</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-4">
              5. Prohibited Use
            </h2>
            <p>You agree not to use the Service:</p>
            <ul className="list-disc pl-8 my-4">
              <li>
                For any unlawful purpose or in violation of any applicable laws
              </li>
              <li>To post false or misleading reviews or content</li>
              <li>To harass, abuse, or harm another person</li>
              <li>To impersonate any person or entity</li>
              <li>
                To engage in any data mining or similar data gathering activity
              </li>
              <li>To transmit any viruses, malware, or other malicious code</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-4">
              6. Restaurant Owner Content
            </h2>
            <p>
              Restaurant owners may provide content about their establishments,
              including descriptions, photos, menus, and responses to reviews.
              Restaurant owners are solely responsible for ensuring that this
              content is accurate, current, and does not violate any third-party
              rights.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-4">
              7. Intellectual Property
            </h2>
            <p>
              The Service and its original content (excluding User Content),
              features, and functionality are and will remain the exclusive
              property of crAIvings and its licensors. The Service is protected
              by copyright, trademark, and other laws.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-4">
              8. AI-Powered Analysis
            </h2>
            <p>
              Our Service includes AI-powered analysis of reviews and feedback.
              While we strive for accuracy in our analysis, we do not guarantee
              that the AI analysis will be error-free or meet your expectations.
              The AI analysis is provided for informational purposes only and
              should not be the sole basis for business decisions.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-4">9. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Service
              immediately, without prior notice or liability, for any reason,
              including without limitation if you breach these Terms.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-4">
              10. Limitation of Liability
            </h2>
            <p>
              In no event shall crAIvings, its directors, employees, partners,
              agents, suppliers, or affiliates be liable for any indirect,
              incidental, special, consequential, or punitive damages, including
              without limitation, loss of profits, data, use, goodwill, or other
              intangible losses, resulting from:
            </p>
            <ul className="list-disc pl-8 my-4">
              <li>Your use or inability to use the Service</li>
              <li>
                Any unauthorized access to or use of our servers and/or personal
                information stored therein
              </li>
              <li>
                Any interruption or cessation of transmission to or from the
                Service
              </li>
              <li>
                Any bugs, viruses, or the like that may be transmitted to or
                through the Service
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-4">
              11. Governing Law
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of the Philippines, without regard to its conflict of law
              provisions.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-4">12. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at{" "}
              <a
                href="mailto:support@craivings.com"
                className="text-primary-600 hover:text-primary-800"
              >
                support@craivings.com
              </a>
              .
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link
              to="/privacy"
              className="text-primary-600 hover:text-primary-800"
            >
              View our Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
