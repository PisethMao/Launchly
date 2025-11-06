"use client";

import Image from "next/image";

export default function TestimonialsSection() {
  return (
    <section className="py-24 font-poppins max-w-7xl mx-auto px-6 md:px-12">
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        Loved by Developers
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mt-3">
        Launchly helps teams ship faster with confidence and zero configuration
        pain.
      </p>
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 shadow-sm hover:shadow-md transition">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            &quot;Launchly reduced our deployment setup time from hours to
            minutes. No DevOps, no server headaches - just push and go
            live.&quot;
          </p>
          <div className="flex items-center gap-3 mt-6">
            <Image
              src="/powin.jpg"
              alt="Powin Image"
              width={100}
              height={100}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">
                Powin Lin
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                System Administrator (SysAdmin)
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 shadow-sm hover:shadow-md transition">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            &quot;Our tem ships updates daily now. The real-time build logs and
            isolated environments solved issues we used to chase for days.&quot;
          </p>
          <div className="flex items-center gap-3 mt-6">
            <Image
              src="/monika.jpg"
              alt="Powin Image"
              width={100}
              height={100}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">
                Monika Phan
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Full Stack Developer
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 shadow-sm hover:shadow-md transition">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            &quot;We used Launchly for hackathon projects and student portfolios
            - setup takes less than a minute. This is how development should
            feel.&quot;
          </p>
          <div className="flex items-center gap-3 mt-6">
            <Image
              src="/chanchhay.jpg"
              alt="Powin Image"
              width={100}
              height={100}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">
                Chanchhay Srey
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Full Stack Developer
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 shadow-sm hover:shadow-md transition">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            &quot;We switched from manual VPS setup to Launchly. No more messing
            with Nginx or SSL renewals. Our deployments are finally
            stress-free.&quot;
          </p>
          <div className="flex items-center gap-3 mt-6">
            <Image
              src="/kompheak.jpg"
              alt="Powin Image"
              width={100}
              height={100}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">
                Kompheak Yan
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Frontend Developer
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 shadow-sm hover:shadow-md transition">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            &quot;Launchly is perfect for classes and workshops. Student deploys
            their projects instantly instead of wasting time configuring
            servers.&quot;
          </p>
          <div className="flex items-center gap-3 mt-6">
            <Image
              src="/nona.jpg"
              alt="Powin Image"
              width={100}
              height={100}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">
                Nona Yorn
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Frontend Team Lead
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 shadow-sm hover:shadow-md transition">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            &quot;No config files. No pipeline setup. Launchly just works. We
            deploy previews for every branch without touching DevOps.&quot;
          </p>
          <div className="flex items-center gap-3 mt-6">
            <Image
              src="/sovanthong.jpg"
              alt="Powin Image"
              width={100}
              height={100}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">
                Sovanthong Soung
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                System Administrator (SysAdmain)
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 shadow-sm hover:shadow-md transition">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            &quot;We integrated Launchly into our graduation project showcase.
            Everyone&apos;s app was deployed live in seconds. It made the event
            run smoothly.&quot;
          </p>
          <div className="flex items-center gap-3 mt-6">
            <Image
              src="/manet.png"
              alt="Powin Image"
              width={100}
              height={100}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">
                Manet Roeun
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Student / Indie Builder
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 shadow-sm hover:shadow-md transition">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            &quot;Setting up deployments used to be the most annoying part.
            Launchly made it the easyest. It feels like magic every time we
            push.&quot;
          </p>
          <div className="flex items-center gap-3 mt-6">
            <Image
              src="/piseth.jpg"
              alt="Powin Image"
              width={100}
              height={100}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">
                Piseth Mao
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Software Engineer
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
