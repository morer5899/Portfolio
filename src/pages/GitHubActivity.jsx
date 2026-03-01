import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FaGithub, FaCode, FaStar,
  FaEye, FaCalendar,
  FaExclamationCircle, FaCheckCircle, FaClock,
  FaUser, FaUsers, FaProjectDiagram, FaChartLine
} from 'react-icons/fa';
import axios from 'axios';
import { FiGitPullRequest } from "react-icons/fi";
import { FiGitMerge } from "react-icons/fi";
import { FiGitCommit } from "react-icons/fi";
import { FiGitBranch } from "react-icons/fi";

// Memoized Components
const ProfileCard = React.memo(({ userData, formatNumber }) => {
  if (!userData) return null;
  
  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
      className="bg-dark-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
    >
      <div className="text-center mb-4">
        <img
          src={userData.avatar_url}
          alt={userData.login}
          className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary-500"
          loading="lazy"
        />
        <h2 className="text-2xl font-bold text-white">{userData.name || userData.login}</h2>
        <p className="text-gray-400">@{userData.login}</p>
        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{userData.bio}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="text-center p-3 bg-dark-200/50 rounded-lg">
          <div className="text-2xl font-bold text-white">{formatNumber(userData.followers)}</div>
          <div className="text-xs text-gray-400">Followers</div>
        </div>
        <div className="text-center p-3 bg-dark-200/50 rounded-lg">
          <div className="text-2xl font-bold text-white">{formatNumber(userData.following)}</div>
          <div className="text-xs text-gray-400">Following</div>
        </div>
      </div>

      <a
        href={userData.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
      >
        <FaGithub />
        View GitHub Profile
      </a>
    </motion.div>
  );
});

const ContributionStats = React.memo(({ years, selectedYear, onYearChange, total, stats }) => (
  <motion.div
    variants={{
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 }
    }}
    className="bg-dark-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
  >
    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
      <FaChartLine className="text-primary-500" />
      Contribution Statistics
    </h3>

    <div className="flex flex-wrap gap-2 mb-4">
      {years.map(year => (
        <button
          key={year}
          onClick={() => onYearChange(year)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            selectedYear === year
              ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
              : 'bg-dark-200/50 text-gray-400 hover:text-white'
          }`}
        >
          {year}
        </button>
      ))}
    </div>

    <div className="text-center mb-4">
      <div className="text-4xl font-bold text-white">
        {total}
      </div>
      <div className="text-gray-400">contributions in {selectedYear}</div>
      <div className="text-xs text-gray-500 mt-1">(real GitHub data)</div>
    </div>

    <div className="space-y-2 mt-4">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Commits</span>
        <span className="text-white font-semibold">{stats.totalCommits[selectedYear] || 0}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Pull Requests</span>
        <span className="text-white font-semibold">{stats.pullRequests[selectedYear] || 0}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Issues</span>
        <span className="text-white font-semibold">{stats.issues[selectedYear] || 0}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Reviews</span>
        <span className="text-white font-semibold">{stats.reviews[selectedYear] || 0}</span>
      </div>
    </div>
  </motion.div>
));

const QuickStats = React.memo(({ repos }) => {
  const totalStars = useMemo(() => 
    repos.reduce((acc, repo) => acc + repo.stargazers_count, 0),
    [repos]
  );

  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
      className="grid grid-cols-2 gap-3"
    >
      <div className="bg-dark-50/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
        <FaCode className="text-primary-500 text-xl mb-2" />
        <div className="text-2xl font-bold text-white">{repos.length}</div>
        <div className="text-xs text-gray-400">Repositories</div>
      </div>
      <div className="bg-dark-50/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
        <FaStar className="text-yellow-500 text-xl mb-2" />
        <div className="text-2xl font-bold text-white">{totalStars}</div>
        <div className="text-xs text-gray-400">Total Stars</div>
      </div>
    </motion.div>
  );
});

const ContributionGrid = React.memo(({ weeks, monthLabels, selectedYear, getContributionColor, formatDate }) => {
  // Fixed unique keys for day labels - using array with unique IDs
  const dayLabelsMobile = useMemo(() => [
    { id: 'mobile-mon', label: 'M' },
    { id: 'mobile-tue', label: 'T' },
    { id: 'mobile-wed', label: 'W' },
    { id: 'mobile-thu', label: 'T' },
    { id: 'mobile-fri', label: 'F' },
    { id: 'mobile-sat', label: 'S' },
    { id: 'mobile-sun', label: 'S' }
  ], []);

  const dayLabelsDesktop = useMemo(() => [
    { id: 'desktop-mon', label: 'Mon' },
    { id: 'desktop-tue', label: 'Tue' },
    { id: 'desktop-wed', label: 'Wed' },
    { id: 'desktop-thu', label: 'Thu' },
    { id: 'desktop-fri', label: 'Fri' },
    { id: 'desktop-sat', label: 'Sat' },
    { id: 'desktop-sun', label: 'Sun' }
  ], []);

  const legendLevels = useMemo(() => [0, 1, 2, 3, 4], []);

  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
      className="bg-dark-50/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <FiGitBranch className="text-primary-500" />
        {selectedYear} Contribution Activity
      </h3>

      {/* Mobile View - Compact Grid */}
      <div className="block sm:hidden">
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[600px]">
            {/* Month labels */}
            <div className="relative h-6 mb-2 ml-8">
              {monthLabels.map(({ label, weekIndex }) => (
                <div
                  key={`mobile-month-${label}-${weekIndex}`}
                  className="absolute text-[10px] text-gray-400"
                  style={{ left: `${weekIndex * 10 + 32}px` }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Contribution Grid */}
            <div className="flex">
              {/* Day labels - using unique keys */}
              <div className="w-8 flex-shrink-0 flex flex-col gap-[1px]">
                {dayLabelsMobile.map((day) => (
                  <div key={day.id} className="h-[8px] text-[8px] text-gray-500 leading-[8px]">
                    {day.label}
                  </div>
                ))}
              </div>

              {/* Contribution squares */}
              <div className="flex gap-[1px]">
                {weeks.map((week, weekIndex) => (
                  <div key={`mobile-week-${weekIndex}`} className="flex flex-col gap-[1px]">
                    {week.map((day, dayIndex) => {
                      const tooltipText = day.count > 0
                        ? `${day.count} contribution${day.count !== 1 ? 's' : ''} on ${formatDate(day.date)}`
                        : `No contributions on ${formatDate(day.date)}`;

                      return (
                        <div
                          key={`mobile-day-${weekIndex}-${dayIndex}-${day.dateKey}`}
                          className={`w-[8px] h-[8px] rounded-sm ${
                            day.inYear ? getContributionColor(day.level) : 'bg-transparent'
                          } hover:ring-1 hover:ring-primary-400 cursor-pointer transition-all duration-150 relative group`}
                        >
                          {day.inYear && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-20 whitespace-nowrap">
                              <div className="bg-gray-900 border border-gray-700 text-white text-[10px] py-0.5 px-1 rounded shadow-xl">
                                {tooltipText}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop View - Full Grid */}
      <div className="hidden sm:block overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Month labels */}
          <div className="relative h-6 mb-2 ml-8">
            {monthLabels.map(({ label, weekIndex }) => (
              <div
                key={`desktop-month-${label}-${weekIndex}`}
                className="absolute text-xs text-gray-400 text-center"
                style={{ left: `${weekIndex * 13}px`, width: '28px' }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Contribution Grid */}
          <div className="flex">
            {/* Day labels - using unique keys */}
            <div className="w-8 flex-shrink-0 flex flex-col gap-[2px]">
              {dayLabelsDesktop.map((day) => (
                <div key={day.id} className="h-[11px] text-[10px] text-gray-500 leading-[11px]">
                  {day.label}
                </div>
              ))}
            </div>

            {/* Contribution squares */}
            <div className="flex gap-[2px]">
              {weeks.map((week, weekIndex) => (
                <div key={`desktop-week-${weekIndex}`} className="flex flex-col gap-[2px]">
                  {week.map((day, dayIndex) => {
                    const tooltipText = day.count > 0
                      ? `${day.count} contribution${day.count !== 1 ? 's' : ''} on ${formatDate(day.date)}`
                      : `No contributions on ${formatDate(day.date)}`;

                    return (
                      <div
                        key={`desktop-day-${weekIndex}-${dayIndex}-${day.dateKey}`}
                        className={`w-[11px] h-[11px] rounded-sm ${
                          day.inYear ? getContributionColor(day.level) : 'bg-transparent'
                        } hover:ring-1 hover:ring-primary-400 cursor-pointer transition-all duration-150 relative group`}
                      >
                        {day.inYear && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-20 whitespace-nowrap">
                            <div className="bg-gray-900 border border-gray-700 text-white text-xs py-1 px-2 rounded shadow-xl">
                              {tooltipText}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-400">
        <span>Less</span>
        <div className="flex gap-[2px]">
          {legendLevels.map(level => (
            <div key={`legend-${level}`} className={`w-[11px] h-[11px] rounded-sm ${getContributionColor(level)}`} />
          ))}
        </div>
        <span>More</span>
      </div>
    </motion.div>
  );
});

const RecentActivity = React.memo(({ events }) => {
  if (events.length === 0) {
    return (
      <motion.div
        variants={{
          hidden: { y: 20, opacity: 0 },
          visible: { y: 0, opacity: 1 }
        }}
        className="bg-dark-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FaClock className="text-primary-500" />
          Recent Activity
        </h3>
        <p className="text-gray-500 text-sm text-center py-4">No recent public activity found.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
      className="bg-dark-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <FaClock className="text-primary-500" />
        Recent Activity
      </h3>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {events.slice(0, 10).map((event, index) => {
          const commitCount = event.type === 'PushEvent' 
            ? event.payload?.commits?.length || 1 
            : 0;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 p-3 bg-dark-200/30 rounded-lg hover:bg-dark-200/50 transition-colors group"
            >
              <div className="text-2xl flex-shrink-0">
                {event.type === 'PushEvent' && '📤'}
                {event.type === 'CreateEvent' && '✨'}
                {event.type === 'IssuesEvent' && '🐛'}
                {event.type === 'PullRequestEvent' && '🔄'}
                {event.type === 'WatchEvent' && '⭐'}
                {event.type === 'ForkEvent' && '🔱'}
                {event.type === 'DeleteEvent' && '🗑️'}
                {event.type === 'PullRequestReviewEvent' && '👀'}
                {event.type === 'IssueCommentEvent' && '💬'}
                {event.type === 'CommitCommentEvent' && '📝'}
                {event.type === 'ReleaseEvent' && '🚀'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">
                  {event.type === 'PushEvent' && (
                    <>Pushed {commitCount} commit{commitCount !== 1 ? 's' : ''} to <span className="text-primary-500 font-semibold">{event.repo.name}</span></>
                  )}
                  {event.type === 'CreateEvent' && (
                    <>Created {event.payload.ref_type} {event.payload.ref && <span className="text-primary-500 font-semibold">{event.payload.ref}</span>} in <span className="text-primary-500 font-semibold">{event.repo.name}</span></>
                  )}
                  {event.type === 'IssuesEvent' && (
                    <>{event.payload.action} issue <span className="text-primary-500 font-semibold">#{event.payload.issue?.number}</span> in <span className="text-primary-500 font-semibold">{event.repo.name}</span></>
                  )}
                  {event.type === 'PullRequestEvent' && (
                    <>{event.payload.action} pull request <span className="text-primary-500 font-semibold">#{event.payload.pull_request?.number}</span> in <span className="text-primary-500 font-semibold">{event.repo.name}</span></>
                  )}
                  {event.type === 'WatchEvent' && (
                    <>Starred <span className="text-primary-500 font-semibold">{event.repo.name}</span></>
                  )}
                  {event.type === 'ForkEvent' && (
                    <>Forked <span className="text-primary-500 font-semibold">{event.repo.name}</span></>
                  )}
                  {event.type === 'PullRequestReviewEvent' && (
                    <>Reviewed pull request in <span className="text-primary-500 font-semibold">{event.repo.name}</span></>
                  )}
                  {event.type === 'IssueCommentEvent' && (
                    <>Commented on issue in <span className="text-primary-500 font-semibold">{event.repo.name}</span></>
                  )}
                  {event.type === 'CommitCommentEvent' && (
                    <>Commented on commit in <span className="text-primary-500 font-semibold">{event.repo.name}</span></>
                  )}
                  {event.type === 'ReleaseEvent' && (
                    <>Released in <span className="text-primary-500 font-semibold">{event.repo.name}</span></>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(event.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
});

const TopRepositories = React.memo(({ repos }) => {
  const sortedRepos = useMemo(() => 
    [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6),
    [repos]
  );

  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
      className="bg-dark-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <FaProjectDiagram className="text-primary-500" />
        Popular Repositories
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sortedRepos.map((repo) => (
          <motion.a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2 }}
            className="block p-4 bg-dark-200/30 rounded-lg hover:bg-dark-200/50 transition-all duration-300 group border border-transparent hover:border-primary-500/50"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-white group-hover:text-primary-500 transition-colors line-clamp-1">
                {repo.name}
              </h4>
              {repo.fork && (
                <span className="text-xs px-2 py-0.5 bg-gray-700 rounded-full text-gray-300 ml-2 whitespace-nowrap flex-shrink-0">fork</span>
              )}
            </div>
            <p className="text-xs text-gray-400 mb-3 line-clamp-2">
              {repo.description || 'No description provided'}
            </p>
            <div className="flex items-center gap-3 text-xs flex-wrap">
              {repo.language && (
                <span className="flex items-center gap-1 text-gray-300">
                  <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                  {repo.language}
                </span>
              )}
              <span className="flex items-center gap-1 text-gray-300">
                <FaStar className="text-yellow-500" />
                {repo.stargazers_count}
              </span>
              <span className="flex items-center gap-1 text-gray-300">
                <FiGitBranch />
                {repo.forks_count}
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
});

const GitHubActivity = () => {
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [contributionData, setContributionData] = useState(null);
  const [stats, setStats] = useState({
    totalCommits: {},
    pullRequests: {},
    issues: {},
    reviews: {}
  });

  const GITHUB_USERNAME = 'morer5899';
  const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN; 
  
  const currentYear = new Date().getFullYear();
  const years = useMemo(() => 
    [currentYear.toString(), (currentYear - 1).toString(), (currentYear - 2).toString()],
    [currentYear]
  );

  const mountedRef = useRef(true);
  const fetchingRef = useRef(false);

  // Memoized container variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delayChildren: 0.3, staggerChildren: 0.1 }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }), []);

  // Fetch REAL contribution data using GraphQL
  const fetchContributionData = useCallback(async (username, year) => {
    const from = `${year}-01-01T00:00:00Z`;
    const to = `${year}-12-31T23:59:59Z`;

    const query = `
      query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                  contributionLevel
                  color
                  weekday
                }
              }
            }
            totalCommitContributions
            totalPullRequestContributions
            totalIssueContributions
            totalPullRequestReviewContributions
            totalRepositoryContributions
          }
        }
      }
    `;

    try {
      const response = await axios.post(
        'https://api.github.com/graphql',
        {
          query,
          variables: { username, from, to }
        },
        {
          headers: {
            'Authorization': `bearer ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.data.user.contributionsCollection;
    } catch (error) {
      console.error('Error fetching contribution data:', error);
      return null;
    }
  }, [GITHUB_TOKEN]);

  const fetchGitHubData = useCallback(async () => {
    if (fetchingRef.current) return;
    
    try {
      fetchingRef.current = true;
      
      const [userRes, reposRes] = await Promise.all([
        axios.get(`https://api.github.com/users/${GITHUB_USERNAME}`),
        axios.get(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100&type=all`)
      ]);

      if (!mountedRef.current) return;

      setUserData(userRes.data);
      setRepos(reposRes.data);

      // Fetch data for all years
      const allYearsData = {};
      const allStats = {
        totalCommits: {},
        pullRequests: {},
        issues: {},
        reviews: {}
      };

      for (const year of years) {
        const yearData = await fetchContributionData(GITHUB_USERNAME, parseInt(year));
        if (yearData && mountedRef.current) {
          allYearsData[year] = yearData;
          allStats.totalCommits[year] = yearData.totalCommitContributions || 0;
          allStats.pullRequests[year] = yearData.totalPullRequestContributions || 0;
          allStats.issues[year] = yearData.totalIssueContributions || 0;
          allStats.reviews[year] = yearData.totalPullRequestReviewContributions || 0;
        }
      }

      if (mountedRef.current) {
        setContributionData(allYearsData);
        setStats(allStats);
      }

      const eventsRes = await axios.get(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100`);
      
      if (mountedRef.current) {
        setEvents(eventsRes.data);
      }

    } catch (error) {
      console.error('Error fetching GitHub data:', error);
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
      fetchingRef.current = false;
    }
  }, [GITHUB_USERNAME, fetchContributionData, years]);

  useEffect(() => {
    mountedRef.current = true;
    fetchGitHubData();

    return () => {
      mountedRef.current = false;
    };
  }, [fetchGitHubData]);

  const getContributionColor = useCallback((level) => {
    switch(level) {
      case 0: return 'bg-gray-800';
      case 1: return 'bg-green-900';
      case 2: return 'bg-green-700';
      case 3: return 'bg-green-500';
      case 4: return 'bg-green-300';
      default: return 'bg-gray-800';
    }
  }, []);

  // Build the contribution grid for the selected year
  const buildYearGrid = useCallback((year) => {
    const yearNum = parseInt(year);
    
    const yearData = contributionData?.[year];
    
    // Create a map of date -> contribution count
    const contributionMap = {};
    if (yearData?.contributionCalendar?.weeks) {
      yearData.contributionCalendar.weeks.forEach(week => {
        week.contributionDays.forEach(day => {
          contributionMap[day.date] = day.contributionCount;
        });
      });
    }
    
    // Get the first day of the year
    const firstDay = new Date(yearNum, 0, 1);
    
    // Find the first Monday on or before Jan 1
    const firstMonday = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    const daysToFirstMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    firstMonday.setDate(firstDay.getDate() - daysToFirstMonday);
    
    // Get the last day of the year
    const lastDay = new Date(yearNum, 11, 31);
    
    // Find the last Sunday on or after Dec 31
    const lastSunday = new Date(lastDay);
    const lastDayOfWeek = lastDay.getDay();
    const daysToLastSunday = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
    lastSunday.setDate(lastDay.getDate() + daysToLastSunday);
    
    // Generate weeks
    const weeks = [];
    const monthLabels = [];
    let currentDate = new Date(firstMonday);
    
    // Track month positions for labels
    const monthPositions = {};
    
    while (currentDate <= lastSunday) {
      const week = [];
      const weekStart = new Date(currentDate);
      
      // Generate 7 days for this week (Monday to Sunday)
      for (let d = 0; d < 7; d++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + d);
        const dateKey = date.toISOString().split('T')[0];
        
        const count = contributionMap[dateKey] || 0;
        
        // Calculate level based on count
        let level = 0;
        if (count > 0) {
          if (count <= 3) level = 1;
          else if (count <= 6) level = 2;
          else if (count <= 9) level = 3;
          else level = 4;
        }
        
        week.push({
          date,
          dateKey,
          count,
          level,
          inYear: date.getFullYear() === yearNum,
          month: date.getMonth(),
          dayOfWeek: d
        });
      }
      
      weeks.push(week);
      currentDate.setDate(currentDate.getDate() + 7);
    }

    // Generate month labels based on the first week each month appears
    weeks.forEach((week, weekIndex) => {
      week.forEach((day) => {
        if (day.inYear && day.date.getDate() <= 7 && day.dayOfWeek === 0) {
          const month = day.month;
          if (!monthPositions[month]) {
            monthPositions[month] = weekIndex;
          }
        }
      });
    });

    // Generate month labels in correct order
    for (let month = 0; month < 12; month++) {
      if (monthPositions[month] !== undefined) {
        monthLabels.push({
          label: new Date(yearNum, month, 1).toLocaleString('default', { month: 'short' }),
          weekIndex: monthPositions[month]
        });
      }
    }

    monthLabels.sort((a, b) => a.weekIndex - b.weekIndex);

    return { 
      weeks, 
      monthLabels, 
      total: yearData?.contributionCalendar?.totalContributions || 0 
    };
  }, [contributionData]);

  const formatNumber = useCallback((num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num;
  }, []);

  const formatDate = useCallback((date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, []);

  const handleYearChange = useCallback((year) => {
    setSelectedYear(year);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-100 pt-20 flex items-center justify-center">
        <div className="loader-3d">
          <div className="loader-cube">
            <div className="cube-face"></div>
            <div className="cube-face"></div>
            <div className="cube-face"></div>
            <div className="cube-face"></div>
            <div className="cube-face"></div>
            <div className="cube-face"></div>
          </div>
        </div>
      </div>
    );
  }

  const { weeks, monthLabels, total } = buildYearGrid(selectedYear);

  return (
    <div className="min-h-screen bg-dark-100 pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center lg:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            GitHub{' '}
            <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              Activity
            </span>
          </h1>
          <p className="text-gray-400 text-lg">Real contribution data from GitHub API</p>
        </motion.div>

        {/* Main Grid - Responsive layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile & Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-1 space-y-6"
          >
            <ProfileCard userData={userData} formatNumber={formatNumber} />
            <ContributionStats 
              years={years}
              selectedYear={selectedYear}
              onYearChange={handleYearChange}
              total={total}
              stats={stats}
            />
            <QuickStats repos={repos} />
          </motion.div>

          {/* Right Column - Activity & Repos */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 space-y-6"
          >
            <ContributionGrid 
              weeks={weeks}
              monthLabels={monthLabels}
              selectedYear={selectedYear}
              getContributionColor={getContributionColor}
              formatDate={formatDate}
            />

            {/* Activity Overview */}
            <motion.div
              variants={itemVariants}
              className="bg-dark-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FaEye className="text-primary-500" />
                Activity Overview
              </h3>
              <div className="space-y-3">
                {repos.length > 0 ? (
                  <p className="text-gray-300 text-sm sm:text-base">
                    Actively contributing to{' '}
                    {repos.slice(0, 3).map((repo, i, arr) => (
                      <React.Fragment key={repo.id}>
                        <a 
                          href={repo.html_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-primary-500 font-semibold hover:underline"
                        >
                          {repo.name}
                        </a>
                        {i < arr.length - 1 ? ', ' : ''}
                      </React.Fragment>
                    ))}
                    {repos.length > 3 && (
                      <> and <span className="text-accent-500 font-semibold">{repos.length - 3} other {repos.length - 3 === 1 ? 'repository' : 'repositories'}</span>
                      </>
                    )}
                  </p>
                ) : (
                  <p className="text-gray-400">No repositories found.</p>
                )}
              </div>
            </motion.div>

            {/* Code Review & Issues */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-dark-50/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <FiGitCommit className="text-green-500 text-xl" />
                  <span className="text-2xl font-bold text-white">{stats.totalCommits[selectedYear] || 0}</span>
                </div>
                <div className="text-sm text-gray-400">Commits in {selectedYear}</div>
                <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: `${Math.min(100, ((stats.totalCommits[selectedYear] || 0) / 500) * 100)}%` }} />
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                className="bg-dark-50/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <FiGitPullRequest className="text-purple-500 text-xl" />
                  <span className="text-2xl font-bold text-white">{stats.pullRequests[selectedYear] || 0}</span>
                </div>
                <div className="text-sm text-gray-400">PRs in {selectedYear}</div>
                <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${Math.min(100, ((stats.pullRequests[selectedYear] || 0) / 50) * 100)}%` }} />
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                className="bg-dark-50/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-red-500/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <FaExclamationCircle className="text-red-500 text-xl" />
                  <span className="text-2xl font-bold text-white">{stats.issues[selectedYear] || 0}</span>
                </div>
                <div className="text-sm text-gray-400">Issues in {selectedYear}</div>
                <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: `${Math.min(100, ((stats.issues[selectedYear] || 0) / 30) * 100)}%` }} />
                </div>
              </motion.div>
            </motion.div>

            <RecentActivity events={events} />
            <TopRepositories repos={repos} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(GitHubActivity);