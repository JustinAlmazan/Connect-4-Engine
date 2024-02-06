import java.util.*;
import javax.swing.plaf.synth.SynthSliderUI;

public class solver 
{   
    public static void main(String [] args) throws Exception
    {
        Scanner sc = new Scanner(System.in);
        long current = sc.nextLong();
        long mask = sc.nextLong();
        int moves = sc.nextInt();

        long startTime = System.nanoTime();
        Position p = new Position(current, mask, moves);
        long endTime = System.nanoTime();
        long totalTime = endTime - startTime;

        System.out.println(negamax(p, -Position.WIDTH*Position.HEIGHT/2, Position.WIDTH*Position.HEIGHT/2));
        System.out.println(totalTime);
    }

    public static int negamax(Position p, int alpha, int beta)
    {
        if (p.moves == Position.MAX_MOVES)
        {
            return 0;
        }

        for (int i = 0; i < Position.WIDTH; i++)
        {
            if (p.canPlay(Position.COLUMN_ORDER[i]) && p.isWinningMove(Position.COLUMN_ORDER[i]))
            {
                return ((Position.WIDTH * Position.HEIGHT+1 - p.moves) / 2);
            }
        }

        int max = (Position.WIDTH * Position.HEIGHT-1 - p.moves)/2;

        if (beta > max)
        {
            beta = max;
            if (alpha >= beta) return beta;
        }

        for (int i = 0; i < Position.WIDTH; i++)
        {
            if (p.canPlay(Position.COLUMN_ORDER[i]))
            {
                Position p2 = new Position(p);
                p2.play(Position.COLUMN_ORDER[i]);
                int score = -negamax(p2, -beta, -alpha);
                
                if (score >= beta) return score;
                if (score > alpha) alpha = score;
            }
        }

        return alpha;
    }
}

class Position
{
    // Constants
    public static final int WIDTH = 7;
    public static final int HEIGHT = 6;
    public static final int MAX_MOVES = 42;

    // Order for searching columns
    public static final int [] COLUMN_ORDER = {3, 2, 4, 1, 5, 0, 6};

    /*  
     *  6   13  20  27  34  41  48
     *  5   12  19  26  33  40  47
     *  4   11  18  25  32  39  46
     *  3   10  17  24  31  38  45
     *  2   9   16  23  30  37  44
     *  1   8   15  22  29  36  43
     *  0   7   14  21  28  35  42
    */

    public long board;
    public long current;
    public long mask;
    public int moves;

    public Position(Position p)
    {
        this.current = p.current;
        this.mask = p.mask;
        this.moves = p.moves;

        this.board = current + mask;
    }

    public Position(long current, long mask, int moves)
    {
        this.current = current;
        this.mask = mask;
        this.moves = moves;

        this.board = current + mask;
    }

    // Returns the topmost bit position in a column
    public static int topRow(int c)
    {
        return (c*WIDTH + 6);
    }

    // Returns true/false if you can/cant play in a column
    public boolean canPlay(int c)
    {
        return (((board >> topRow(c)) & 1) == 0);
    }

    // Returns an integer 0 <= i <= 48 representing 
    // the spot directly above the topmost tile placed
    public int getBit(int c)
    {
        int top = topRow(c);

        while (top >= c*WIDTH && board >> top == 0)
        {
            top--;
        } 

        return top;
    }

    // Returns which row the next tile will be placed in
    // for a given column, and 6 if it is full.
    public int getRow(int c)
    {
        return getBit(c) % 7;
    }

    public void play(int c)
    {
        current ^= mask;
        mask |= mask + bottom_mask(c);
        board = mask + current;
        moves++;
    }

    public boolean alignment(long pos) {
        // horizontal 
        long m = pos & (pos >> (Position.HEIGHT+1));
        if((m & (m >> (2*(Position.HEIGHT+1)))) != 0) return true;

        // diagonal 1
        m = pos & (pos >> Position.HEIGHT);
        if((m & (m >> (2*Position.HEIGHT))) != 0) return true;

        // diagonal 2 
        m = pos & (pos >> (Position.HEIGHT+2));
        if((m & (m >> (2*(Position.HEIGHT+2)))) != 0) return true;

        // vertical;
        m = pos & (pos >> 1);
        if((m & (m >> 2)) != 0) return true;

        return false;
    }

    public long bottom_mask(int col)
    {
        return 1L << col*(HEIGHT+1);
    }

    public long column_mask(int col)
    {
        return ((1L << HEIGHT) - 1) << col*(HEIGHT + 1);
    }

    public boolean isWinningMove(int col)
    {
        long pos = current;
        pos |= (mask + bottom_mask(col)) & column_mask(col);
        return alignment(pos);
    }
}
