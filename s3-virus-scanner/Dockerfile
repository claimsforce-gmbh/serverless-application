# Source: https://dev.to/sutt0n/using-a-lambda-container-to-scan-files-with-clamav-via-serverless-2a5g
FROM amazonlinux:2 AS pre-image

WORKDIR /home/build

RUN set -e

RUN echo "Prepping ClamAV"

RUN rm -rf bin
RUN rm -rf lib

RUN yum update -y
RUN amazon-linux-extras install epel -y
RUN yum install -y cpio yum-utils tar.x86_64 gzip zip

RUN yumdownloader -x \*i686 --archlist=x86_64 clamav
RUN rpm2cpio clamav-0*.rpm | cpio -vimd

RUN yumdownloader -x \*i686 --archlist=x86_64 clamav-lib
RUN rpm2cpio clamav-lib*.rpm | cpio -vimd

RUN yumdownloader -x \*i686 --archlist=x86_64 clamav-update
RUN rpm2cpio clamav-update*.rpm | cpio -vimd

RUN yumdownloader -x \*i686 --archlist=x86_64 json-c
RUN rpm2cpio json-c*.rpm | cpio -vimd

RUN yumdownloader -x \*i686 --archlist=x86_64 pcre2
RUN rpm2cpio pcre*.rpm | cpio -vimd

RUN yumdownloader -x \*i686 --archlist=x86_64 libtool-ltdl
RUN rpm2cpio libtool-ltdl*.rpm | cpio -vimd

RUN yumdownloader -x \*i686 --archlist=x86_64 libxml2
RUN rpm2cpio libxml2*.rpm | cpio -vimd

RUN yumdownloader -x \*i686 --archlist=x86_64 bzip2-libs
RUN rpm2cpio bzip2-libs*.rpm | cpio -vimd

RUN yumdownloader -x \*i686 --archlist=x86_64 xz-libs
RUN rpm2cpio xz-libs*.rpm | cpio -vimd

RUN yumdownloader -x \*i686 --archlist=x86_64 libprelude
RUN rpm2cpio libprelude*.rpm | cpio -vimd

RUN yumdownloader -x \*i686 --archlist=x86_64 gnutls
RUN rpm2cpio gnutls*.rpm | cpio -vimd

RUN yumdownloader -x \*i686 --archlist=x86_64 nettle
RUN rpm2cpio nettle*.rpm | cpio -vimd

RUN mkdir -p bin
RUN mkdir -p lib
RUN mkdir -p var/lib/clamav
RUN chmod -R 777 var/lib/clamav

COPY config/freshclam.conf /etc/freshclam.conf

RUN cp usr/bin/clamscan usr/bin/freshclam bin/.
RUN cp usr/lib64/* lib/.

RUN yum install shadow-utils.x86_64 -y

RUN mkdir -p /opt/var/lib/clamav
RUN chmod -R 777 /opt/var/lib/clamav

RUN groupadd clamav
RUN useradd -g clamav -s /bin/false -c "Clam Antivirus" clamav
RUN useradd -g clamav -s /bin/false -c "Clam Antivirus" clamupdate

RUN LD_LIBRARY_PATH=./lib ./bin/freshclam

# Container Images
FROM public.ecr.aws/lambda/nodejs:14

ENV PATH=/var/lang/bin:/usr/local/bin:/usr/bin/:/bin:/opt/bin

RUN mkdir -p var/lib/clamav
RUN chmod -R 777 var/lib/clamav
RUN mkdir -p /opt/var/lib/clamav
RUN chmod -R 777 /opt/var/lib/clamav

COPY --from=pre-image /home/build/var/lib/* /usr/local/bin/
COPY --from=pre-image /home/build/lib/* /usr/lib64/
COPY --from=pre-image /home/build/bin/* /usr/local/bin/
COPY --from=pre-image /opt/var/lib/clamav/* /opt/var/lib/clamav/
COPY --from=pre-image /etc/passwd /etc/passwd

COPY config/freshclam.conf /etc/freshclam.conf

ADD .build/build.tar.gz ./dist/
