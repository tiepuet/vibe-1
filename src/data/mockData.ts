import { User, Event, Criteria, Idea, Team, TeamMember, Project, Judge, JudgeScore } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    full_name: 'Nguyễn Văn Admin',
    email: 'admin@teko.vn',
    role: 'admin',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    full_name: 'Trần Thị User',
    email: 'user@teko.vn',
    role: 'user',
    created_at: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    full_name: 'Lê Minh Đức',
    email: 'duc.le@teko.vn',
    role: 'user',
    created_at: '2024-01-03T00:00:00Z'
  },
  {
    id: '4',
    full_name: 'Phạm Thu Hương',
    email: 'huong.pham@teko.vn',
    role: 'user',
    created_at: '2024-01-04T00:00:00Z'
  }
];

// Mock Events
export const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Teko Innovation Challenge 2024',
    slogan: 'Khơi nguồn sáng tạo - Kiến tạo tương lai',
    description: 'Cuộc thi sáng tạo công nghệ dành cho nhân viên Teko, nhằm tìm kiếm những ý tưởng đột phá và giải pháp sáng tạo cho các thách thức kinh doanh.',
    image_url: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
    start_time: '2024-03-01T09:00:00Z',
    end_time: '2024-03-30T18:00:00Z',
    status: 'open',
    created_by: '1',
    created_at: '2024-02-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'AI Hackathon 2024',
    slogan: 'Trí tuệ nhân tạo - Tương lai trong tầm tay',
    description: 'Cuộc thi phát triển ứng dụng AI cho các lĩnh vực e-commerce và fintech.',
    image_url: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
    start_time: '2024-04-15T09:00:00Z',
    end_time: '2024-04-20T18:00:00Z',
    status: 'draft',
    created_by: '1',
    created_at: '2024-02-15T00:00:00Z'
  }
];

// Mock Criteria
export const mockCriteria: Criteria[] = [
  {
    id: '1',
    event_id: '1',
    name: 'Tính sáng tạo',
    description: 'Đánh giá mức độ sáng tạo và tính độc đáo của ý tưởng',
    weight: 3,
    max_score: 10
  },
  {
    id: '2',
    event_id: '1',
    name: 'Tính khả thi',
    description: 'Khả năng triển khai thực tế của dự án',
    weight: 2,
    max_score: 10
  },
  {
    id: '3',
    event_id: '1',
    name: 'Tác động kinh doanh',
    description: 'Mức độ tác động tích cực đến hoạt động kinh doanh',
    weight: 3,
    max_score: 10
  },
  {
    id: '4',
    event_id: '1',
    name: 'Thực hiện kỹ thuật',
    description: 'Chất lượng code và demo sản phẩm',
    weight: 2,
    max_score: 10
  }
];

// Mock Ideas
export const mockIdeas: Idea[] = [
  {
    id: '1',
    event_id: '1',
    user_id: '2',
    title: 'AI Chatbot hỗ trợ khách hàng',
    description: 'Phát triển chatbot thông minh để hỗ trợ khách hàng 24/7 với khả năng hiểu ngôn ngữ tự nhiên.',
    status: 'approved',
    created_at: '2024-02-05T00:00:00Z'
  },
  {
    id: '2',
    event_id: '1',
    user_id: '3',
    title: 'Hệ thống dự đoán xu hướng thị trường',
    description: 'Sử dụng machine learning để phân tích và dự đoán xu hướng thị trường e-commerce.',
    status: 'approved',
    created_at: '2024-02-06T00:00:00Z'
  },
  {
    id: '3',
    event_id: '1',
    user_id: '4',
    title: 'App quản lý tài chính cá nhân',
    description: 'Ứng dụng giúp người dùng quản lý chi tiêu và đầu tư thông minh.',
    status: 'pending',
    created_at: '2024-02-07T00:00:00Z'
  }
];

// Mock Teams
export const mockTeams: Team[] = [
  {
    id: '1',
    event_id: '1',
    name: 'Tech Innovators',
    status: 'approved',
    created_at: '2024-02-10T00:00:00Z'
  },
  {
    id: '2',
    event_id: '1',
    name: 'AI Masters',
    status: 'approved',
    created_at: '2024-02-11T00:00:00Z'
  },
  {
    id: '3',
    event_id: '1',
    name: 'Future Builders',
    status: 'pending',
    created_at: '2024-02-12T00:00:00Z'
  }
];

// Mock Team Members
export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    team_id: '1',
    user_id: '2',
    role: 'leader'
  },
  {
    id: '2',
    team_id: '1',
    user_id: '3',
    role: 'member'
  },
  {
    id: '3',
    team_id: '2',
    user_id: '4',
    role: 'leader'
  }
];

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: '1',
    event_id: '1',
    team_id: '1',
    idea_id: '1',
    scheduled_time: '2024-03-25T14:00:00Z',
    code_link: 'https://github.com/team1/ai-chatbot',
    slide_link: 'https://docs.google.com/presentation/d/abc123',
    demo_link: 'https://demo.team1.com',
    submitted_at: '2024-03-24T16:30:00Z'
  },
  {
    id: '2',
    event_id: '1',
    team_id: '2',
    idea_id: '2',
    scheduled_time: '2024-03-25T15:00:00Z',
    code_link: null,
    slide_link: null,
    demo_link: null,
    submitted_at: null
  }
];

// Mock Judges
export const mockJudges: Judge[] = [
  {
    id: '1',
    event_id: '1',
    user_id: '1'
  }
];

// Mock Judge Scores
export const mockJudgeScores: JudgeScore[] = [
  {
    id: '1',
    project_id: '1',
    judge_id: '1',
    submitted_at: '2024-03-25T16:00:00Z',
    total_score: 85
  }
];