module.exports = [
    // Default rules that semantic-release will fall back to if our custom rules
    // do not match.  Copy/pasting here so we have the entire ruleset in this
    // file.
    { breaking: true, release: 'major' },
    { revert: true, release: 'patch' },
    { type: 'feat', release: 'minor' },
    { type: 'fix', release: 'patch' },
    { type: 'perf', release: 'patch' },
  
    /**
     * Endpoint custom rules
     */
    // Failsafe in case generic rules don't match, the following rules will
    // force the corresponding release
    { subject: /\[release\spatch\]/, release: 'patch' },
    { subject: /\[release\sminor\]/, release: 'minor' },
    { subject: /\[release\smajor\]/, release: 'major' },
  ];
  