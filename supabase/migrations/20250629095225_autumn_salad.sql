/*
  # Community and Chat System Schema

  1. New Tables
    - `channels`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `type` (text) - 'text' or 'voice'
      - `is_private` (boolean)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamp)

    - `messages`
      - `id` (uuid, primary key)
      - `channel_id` (uuid, references channels)
      - `user_id` (uuid, references profiles)
      - `content` (text)
      - `reply_to` (uuid, references messages)
      - `is_pinned` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `message_reactions`
      - `id` (uuid, primary key)
      - `message_id` (uuid, references messages)
      - `user_id` (uuid, references profiles)
      - `emoji` (text)
      - `created_at` (timestamp)

    - `channel_members`
      - `id` (uuid, primary key)
      - `channel_id` (uuid, references channels)
      - `user_id` (uuid, references profiles)
      - `role` (text) - 'member', 'moderator', 'admin'
      - `joined_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

-- Create channels table
CREATE TABLE IF NOT EXISTS channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  type text DEFAULT 'text' CHECK (type IN ('text', 'voice')),
  is_private boolean DEFAULT false,
  created_by uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid REFERENCES channels(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  reply_to uuid REFERENCES messages(id) ON DELETE SET NULL,
  is_pinned boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create message_reactions table
CREATE TABLE IF NOT EXISTS message_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES messages(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  emoji text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(message_id, user_id, emoji)
);

-- Create channel_members table
CREATE TABLE IF NOT EXISTS channel_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid REFERENCES channels(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role text DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(channel_id, user_id)
);

-- Enable RLS
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_members ENABLE ROW LEVEL SECURITY;

-- Channels policies
CREATE POLICY "Public channels are viewable by everyone"
  ON channels
  FOR SELECT
  USING (NOT is_private OR id IN (
    SELECT channel_id FROM channel_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Authenticated users can create channels"
  ON channels
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Channel creators can update their channels"
  ON channels
  FOR UPDATE
  USING (auth.uid() = created_by);

-- Messages policies
CREATE POLICY "Users can view messages in accessible channels"
  ON messages
  FOR SELECT
  USING (
    channel_id IN (
      SELECT id FROM channels 
      WHERE NOT is_private OR id IN (
        SELECT channel_id FROM channel_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Authenticated users can insert messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    channel_id IN (
      SELECT id FROM channels 
      WHERE NOT is_private OR id IN (
        SELECT channel_id FROM channel_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update their own messages"
  ON messages
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages"
  ON messages
  FOR DELETE
  USING (auth.uid() = user_id);

-- Message reactions policies
CREATE POLICY "Users can view reactions on accessible messages"
  ON message_reactions
  FOR SELECT
  USING (
    message_id IN (
      SELECT id FROM messages WHERE channel_id IN (
        SELECT id FROM channels 
        WHERE NOT is_private OR id IN (
          SELECT channel_id FROM channel_members WHERE user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Authenticated users can add reactions"
  ON message_reactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own reactions"
  ON message_reactions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Channel members policies
CREATE POLICY "Users can view channel members"
  ON channel_members
  FOR SELECT
  USING (
    channel_id IN (
      SELECT id FROM channels 
      WHERE NOT is_private OR id IN (
        SELECT channel_id FROM channel_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can join public channels"
  ON channel_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    channel_id IN (SELECT id FROM channels WHERE NOT is_private)
  );

CREATE POLICY "Users can leave channels"
  ON channel_members
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default channels
INSERT INTO channels (name, description, type, is_private, created_by) VALUES
  ('umum', 'Diskusi umum untuk semua anggota', 'text', false, (SELECT id FROM profiles LIMIT 1)),
  ('tanya-jawab', 'Tempat bertanya dan menjawab', 'text', false, (SELECT id FROM profiles LIMIT 1)),
  ('pengumuman', 'Pengumuman penting dari instruktur', 'text', false, (SELECT id FROM profiles LIMIT 1)),
  ('analisis-data', 'Diskusi tentang analisis data', 'text', false, (SELECT id FROM profiles LIMIT 1)),
  ('tinjauan-pustaka', 'Diskusi tentang literature review', 'text', false, (SELECT id FROM profiles LIMIT 1))
ON CONFLICT DO NOTHING;