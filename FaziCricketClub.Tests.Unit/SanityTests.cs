namespace FaziCricketClub.Tests.Unit
{
    /// <summary>
    /// A very simple sanity test to verify that the test infrastructure is working.
    /// As we build out the domain and application layers, real tests will be added here.
    /// </summary>
    public class SanityTests
    {
        [Fact]
        public void True_should_be_true()
        {
            // Arrange
            var value = true;

            // Act & Assert
            Assert.True(value);
        }

        [Fact]
        public void One_plus_one_should_equal_two()
        {
            // Arrange
            int a = 1;
            int b = 1;

            // Act
            int result = a + b;

            // Assert
            Assert.Equal(2, result);
        }
    }
}
