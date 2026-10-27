import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Use | NihongoStudy',
    description: 'Terms of use for NihongoStudy, a free JLPT Japanese study platform.',
};

const sections = [
    {
        title: '1. Acceptance of These Terms',
        body: `By creating an account or using NihongoStudy, you agree to these Terms of Use and to our Privacy Policy. If you do not agree, please do not use the site.`,
    },
    {
        title: '2. About the Service',
        body: `NihongoStudy is a free Japanese language study platform built and operated by Lorenzo Balitian, based in the Philippines. It is provided for personal learning and is offered as is, without any promise that it will always be available or free of errors.`,
    },
    {
        title: '3. Eligibility and Accounts',
        list: [
            'You must be at least 13 years old to create an account.',
            'If you are under 18, you must have permission from a parent or guardian.',
            'Provide accurate information when you sign up and keep your password private.',
            'You are responsible for all activity on your account.',
        ],
    },
    {
        title: '4. Acceptable Use',
        body: `You agree not to:`,
        list: [
            'Try to access the accounts or data of other users',
            'Interfere with or try to break the security of the site',
            'Use bots, scrapers, or automated tools to overload the service or copy its content in bulk',
            'Use the site for anything unlawful or abusive',
        ],
    },
    {
        title: '5. Study Content Disclaimer',
        body: `Study content (kana, kanji, vocabulary, grammar, and quizzes) was created by the site owner with the help of AI tools and may contain mistakes. JLPT levels shown on the site are approximate. NihongoStudy is not affiliated with, endorsed by, or sponsored by the JLPT, the Japan Foundation, or Japan Educational Exchanges and Services, and using it does not guarantee any exam result. Please verify important material with official resources.`,
    },
    {
        title: '6. Intellectual Property',
        body: `The site design, code, and original study content belong to the site owner. You may use NihongoStudy for personal, non-commercial learning. Please do not copy, resell, or redistribute the content without permission. External links, such as Jisho.org, lead to third-party sites with their own terms.`,
    },
    {
        title: '7. Donations',
        body: `NihongoStudy stays free to use. Support through Ko-fi is voluntary, is handled by Ko-fi under its own terms, and does not unlock any features or create any obligation for either side.`,
    },
    {
        title: '8. Suspension and Termination',
        body: `We may suspend or remove accounts that break these terms or put the service or other users at risk. You can stop using the site at any time and can ask us to delete your account as described in our Privacy Policy.`,
    },
    {
        title: '9. No Warranty',
        body: `The service is provided as is and as available, without warranties of any kind, to the extent permitted by law.`,
    },
    {
        title: '10. Limitation of Liability',
        body: `To the extent permitted by law, the site owner is not liable for any loss or damage arising from your use of, or inability to use, NihongoStudy, including lost progress or study data. Because the service is free and still growing, please keep your own notes of anything important.`,
    },
    {
        title: '11. Changes',
        body: `We may change the service or these terms as the platform grows. Changes will be posted on this page with an updated date. Continuing to use the site after a change means you accept the updated terms.`,
    },
    {
        title: '12. Governing Law',
        body: `These terms are governed by the laws of the Philippines.`,
    },
    {
        title: '13. Contact',
        body: `Questions about these terms:`,
        contact: true,
    },
];

export default function TermsPage() {
    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    <span className="font-jp">利用規約</span> Terms of Use
                </h1>
                <p className="text-muted text-sm">Last updated: October 25, 2026</p>
                <p className="text-sm mt-2">
                    <Link href="/privacy" className="text-primary hover:underline transition-all">
                        Read our Privacy Policy
                    </Link>
                </p>
            </div>

            {/* Content card */}
            <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-8">
                {sections.map((section) => (
                    <section key={section.title}>
                        <h2 className="text-lg font-semibold text-primary mb-3">{section.title}</h2>

                        {section.body && (
                            <p className="text-muted text-sm leading-relaxed">{section.body}</p>
                        )}

                        {section.list && (
                            <ul className="list-disc list-inside text-muted text-sm leading-relaxed space-y-1 mt-2">
                                {section.list.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        )}

                        {section.contact && (
                            <p className="text-sm mt-2">
                                <a
                                    href="mailto:nihongostudy.support@gmail.com"
                                    className="text-primary hover:underline transition-all"
                                >
                                    nihongostudy.support@gmail.com
                                </a>
                            </p>
                        )}
                    </section>
                ))}
            </div>
        </div>
    );
}