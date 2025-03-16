import React from "react";
import { Link } from "react-router-dom";

const PrivacyPage = () => {
  return (
    <div className="py-12 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

          <div className="prose prose-lg max-w-none">
            <p className="mb-4">Last Updated: March 15, 2025</p>

            <p className="mb-4">
              At crAIvings, we respect your privacy and are committed to
              protecting your personal data. This Privacy Policy explains how we
              collect, use, and safeguard your information when you use our
              website and services.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-4">
              1. Information We Collect
            </h2>
            <p>
              We collect several types of information from and about users of
              our Service, including:
            </p>
            <ul className="list-disc pl-8 my-4">
              <li>
                <strong>Personal Data:</strong> Name, email address, and profile
                information when you register for an account.
              </li>
              <li>
                <strong>User Content:</strong> Reviews, ratings, and comments
                you post on the Service.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you use our
                Service, including the pages you visit and the features you
                access.
              </li>
              <li>
                <strong>Device Information:</strong> Information about the
                device you use to access our Service, including IP address,
                browser type, and operating system.
              </li>
              <li>
                <strong>Location Data:</strong> With your consent, we may
                collect precise or approximate location information to provide
                location-based services.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-4">
              2. How We Use Your Information
            </h2>
            <p>We use your information for the following purposes:</p>
            <ul className="list-disc pl-8 my-4">
              <li>To provide and maintain our Service</li>
              <li>
                To authenticate users and provide access to specific features
              </li>
              <li>
                To analyze restaurant reviews and provide AI-powered insights
              </li>
              <li>To notify you about changes to our Service</li>
              <li>To provide customer support</li>
              <li>To gather analysis and feedback to improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent, and address technical issues</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-4">
              3. Data Retention
            </h2>
            <p>
              We will retain your personal data only for as long as necessary
              for the purposes set out in this Privacy Policy. We will retain
              and use your personal data to the extent necessary to comply with
              our legal obligations, resolve disputes, and enforce our legal
              agreements and policies.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-4">
              4. Data Security
            </h2>
            <p>
              The security of your data is important to us. We strive to use
              commercially acceptable means to protect your personal data, but
              no method of transmission over the Internet or method of
              electronic storage is 100% secure. While we implement safeguards
              to protect your information, we cannot guarantee its absolute
              security.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-4">
              5. Sharing Your Information
            </h2>
            <p>We may share your information in the following situations:</p>
            <ul className="list-disc pl-8 my-4">
              <li>
                <strong>With Service Providers:</strong> We may share your
                information with third-party vendors, service providers, and
                contractors who perform services for us or on our behalf.
              </li>
              <li>
                <strong>Public Reviews:</strong> When you post reviews or
                comments, they may be visible to other users of the Service.
              </li>
              <li>
                <strong>Business Transfers:</strong> If we are involved in a
                merger, acquisition, or sale of all or a portion of our assets,
                your information may be transferred as part of that transaction.
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose your
                information if required by law or in response to valid requests
                by public authorities.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-4">
              6. Cookies and Tracking Technologies
            </h2>
            <p>
              We use cookies and similar tracking technologies to track activity
              on our Service and hold certain information. You can instruct your
              browser to refuse all cookies or to indicate when a cookie is
              being sent. However, if you do not accept cookies, you may not be
              able to use some portions of our Service.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-4">
              7. Third-Party Services
            </h2>
            <p>
              Our Service may contain links to other websites or services that
              are not operated by us. If you click on a third-party link, you
              will be directed to that third party's site. We strongly advise
              you to review the Privacy Policy of every site you visit. We have
              no control over and assume no responsibility for the content,
              privacy policies, or practices of any third-party sites or
              services.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-4">
              8. Children's Privacy
            </h2>
            <p>
              Our Service is not intended for use by children under the age of
              18. We do not knowingly collect personally identifiable
              information from children under 18. If you are a parent or
              guardian and you are aware that your child has provided us with
              personal data, please contact us.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-4">9. Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding
              your personal data, including:
            </p>
            <ul className="list-disc pl-8 my-4">
              <li>The right to access the personal data we hold about you</li>
              <li>
                The right to request correction or deletion of your personal
                data
              </li>
              <li>
                The right to restrict or object to our processing of your
                personal data
              </li>
              <li>The right to data portability</li>
              <li>
                The right to withdraw consent at any time, where we rely on
                consent for processing
              </li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information
              provided below.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-4">
              10. Changes to This Privacy Policy
            </h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the "Last Updated" date. You are advised to review
              this Privacy Policy periodically for any changes.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-4">11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at{" "}
              <a
                href="mailto:privacy@craivings.com"
                className="text-primary-600 hover:text-primary-800"
              >
                privacy@craivings.com
              </a>
              .
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link
              to="/terms"
              className="text-primary-600 hover:text-primary-800"
            >
              View our Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
