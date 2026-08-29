FROM mcr.microsoft.com/dotnet/sdk:10.0

WORKDIR /workspace

RUN useradd -m learner

RUN mkdir -p /workspace \
    && chown -R learner:learner /workspace

USER learner

CMD ["bash"]