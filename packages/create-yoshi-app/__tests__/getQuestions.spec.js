const getQuestions = require('../src/getQuestions');

jest.mock('parse-git-config');

const getQuestion = name => getQuestions().find(item => item.name === name);

describe('authorEmail', () => {
  const mockEnvUser = value => (process.env.USER = value);
  const currentUser = process.env.USER;
  afterEach(() => {
    process.env.USER = currentUser;
  });
  const EMAIL_VALIDATION_ERROR = 'Please enter a @wix.com email';

  describe('initial', () => {
    it('it should use email from git config if it has a `@wix.com` domain name', async () => {
      require('parse-git-config').sync.mockReturnValue({
        user: { email: 'artemyFromGit@wix.com' },
      });
      const emailQuestion = getQuestion('authorEmail');
      const { initial } = emailQuestion;
      expect(initial).toBe('artemyFromGit@wix.com');
    });

    it('it should use email from process.env.USER if no git config specified', async () => {
      require('parse-git-config').sync.mockReturnValue({});
      mockEnvUser('artemyFromEnv');
      const emailQuestion = getQuestion('authorEmail');
      const { initial } = emailQuestion;
      expect(initial).toBe('artemyFromEnv@wix.com');
    });

    it('it should use empty value if no process.env.USER and git config specified', async () => {
      require('parse-git-config').sync.mockReturnValue({});
      delete process.env.USER;
      const emailQuestion = getQuestion('authorEmail');
      const { initial } = emailQuestion;
      expect(initial).toBe('');
    });
  });

  describe('format', () => {
    it('it should format email value if no @wix.com specified', async () => {
      const emailQuestion = getQuestion('authorEmail');
      const { format } = emailQuestion;
      expect(format('artemy')).toBe('artemy@wix.com');
    });

    it('it should not format email value if @wix.com specified', async () => {
      const emailQuestion = getQuestion('authorEmail');
      const { format } = emailQuestion;
      expect(format('artemy@wix.com')).toBe('artemy@wix.com');
    });
  });

  describe('validate', () => {
    it('it should correctly validate email w/o @wix.com part', async () => {
      const emailQuestion = getQuestion('authorEmail');
      const { validate } = emailQuestion;
      expect(validate('artemy')).toBe(true);
    });

    it('it should correctly validate email with @wix.com part', async () => {
      const emailQuestion = getQuestion('authorEmail');
      const { validate } = emailQuestion;
      expect(validate('artemy@wix.com')).toBe(true);
    });

    it('it should correctly validate email w/o incorrect email provider', async () => {
      const emailQuestion = getQuestion('authorEmail');
      const { validate } = emailQuestion;
      expect(validate('artemy@gmail.com')).toBe(EMAIL_VALIDATION_ERROR);
    });

    it('it should correctly validate empty email', async () => {
      const emailQuestion = getQuestion('authorEmail');
      const { validate } = emailQuestion;
      expect(validate('')).toBe(EMAIL_VALIDATION_ERROR);
    });
  });
});
