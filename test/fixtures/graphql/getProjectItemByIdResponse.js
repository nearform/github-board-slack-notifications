export default (user = 'testuser') => ({
  node: {
    creator: {
      url: `https://github.com/${user}`,
      login: user,
    },
    id: 'PVTI_lADOBpWafM4AEgSvzgB_LQk',
    project: {
      title: 'Test board',
      number: 1,
      url: 'https://github.com/orgs/test-org/projects/1',
      field: {
        name: 'SlackChannel',
        options: [
          {
            name: 'test-channel',
          },
        ],
      },
    },
    content: {
      assignees: {
        nodes: [],
      },
      author: {
        url: `https://github.com/${user}`,
        login: user,
        name: 'Test User',
      },
      id: 'I_kwDOHwYncM5PZJ_7',
      title: 'A lot of stuff going on here',
      body: '',
      url: 'https://github.com/test-org/test-repo-1/issues/1',
      number: 1,
      repository: {
        url: 'https://github.com/test-org/test-repo-1',
        name: 'test-repo-1',
      },
    },
    fieldValueByName: {
      id: 'PVTFSV_lQDOBpWafM4AEgSvzgB_LQnOAV2TJg',
      name: 'In Progress',
    },

    // when a project is queried:
    title: 'Test board',
    number: 1,
    url: 'https://github.com/orgs/test-org/projects/1',
    field: {
      name: 'SlackChannel',
      options: [
        {
          name: 'test-channel',
        },
      ],
    },
  },
})
